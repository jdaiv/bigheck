varying highp vec2 vTextureCoord;

void main() {
    float staticX = abs(sin(gl_FragCoord.x / 20.0) / 50.0);
    float yOffset =
        sin(uTime / 1600. + gl_FragCoord.x / 50.0) * 2.0 +
        sin(uTime / 800.0 + gl_FragCoord.x / 10.0) * 2.0 +
        sin(uTime / 800.0 + gl_FragCoord.x / 20.0) * 1.0 -
        sin(uTime / 200.0 + gl_FragCoord.x / 20.0) * 1.0;
    float waveX = sin(uTime / 400.0 + gl_FragCoord.x / 10.0) / 10.0;
    float waveY = cos(uTime / 400.0 + gl_FragCoord.y / 50.0) / 20.0;
    float alpha = 1.0;
    gl_FragColor = vec4(
        (staticX + waveX + waveY + uColor.xyz) * alpha,
        uColor.w * alpha);
}