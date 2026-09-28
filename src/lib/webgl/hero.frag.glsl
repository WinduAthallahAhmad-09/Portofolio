#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColorA; // --bg
uniform vec3 uColorB; // --surface-2
uniform vec3 uColorC; // --accent
uniform int uOctaves;

out vec4 fragColor;

// Utility for randomness
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Quintic interpolation
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// FBM
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
        if (i >= uOctaves) break;
        value += amplitude * noise(p * frequency);
        p *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

// Domain Warping
float pattern(vec2 p, out vec2 q, out vec2 r) {
    q.x = fbm(p + vec2(0.0, 0.0) + uTime * 0.05);
    q.y = fbm(p + vec2(5.2, 1.3) + uTime * 0.05);

    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + uTime * 0.02);
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + uTime * 0.03);

    return fbm(p + 4.0 * r);
}

void main() {
    // 1. UV dikoreksi aspek
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    // 3. Pengaruh mouse: distorsi dalam radius 0.35
    // Mouse coords are normalized 0-1, convert to -1 to 1 and correct aspect
    vec2 m = uMouse * 2.0 - 1.0;
    m.x *= uResolution.x / uResolution.y;
    
    float dMouse = length(p - m);
    float mouseEffect = smoothstep(0.35, 0.0, dMouse);
    
    // Scale down the space for larger pattern
    vec2 space = p * 1.5;
    space += (m - p) * mouseEffect * 0.5; // Distort space towards mouse

    // 2. Domain warping
    vec2 q, r;
    float f = pattern(space, q, r);

    // 4. Warna hasil di-map ke tiga warna
    vec3 color = mix(uColorA, uColorB, clamp((f * f) * 3.0, 0.0, 1.0));
    color = mix(color, uColorC, clamp(length(q) * f * 2.0 - 0.5, 0.0, 1.0)); // accent only at peaks

    // 5. Film grain (amp 0.04) and vignette
    float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.08; // amplitude 0.04 (-0.04 to 0.04 approx)
    color += grain;

    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    color *= vignette;

    fragColor = vec4(color, 1.0);
}
