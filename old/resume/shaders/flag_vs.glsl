varying highp vec2 vScreenCoord;
varying highp vec2 vTextureCoord;

void main() {
    vec2 waves = (aScreenCoord.xy + vec2(0,
        sin(uTime / 1600. + aScreenCoord.x / 50.0) * 2.0 +
        sin(uTime / 800. + aScreenCoord.x / 10.0) * 2.0 +
        sin(uTime / 800. + aScreenCoord.x / 20.0) * 1.0 -
        sin(uTime / 200. + aScreenCoord.x / 20.0) * 1.0)
    );
    gl_Position = vec4(((
        (
            waves
        ) - uScreenScroll) /
            uScreenSize * vec2(2, -2)) + vec2(-1, 1),
        aScreenCoord.z, 1);
    vTextureCoord = aTextureCoord;
}