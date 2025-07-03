uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;

void main() {
    vec3 color = vec3(1.0);

    float colorMix1 = smoothstep(-0.75, 1.0, vWobble);

    color = mix(uColorA, uColorB, colorMix1);

    csm_Roughness = 1.0 - colorMix1;
    csm_DiffuseColor = vec4(color, 1.0);
}