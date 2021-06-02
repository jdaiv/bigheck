varying highp vec2 vTextureCoord;

void main() {
    gl_Position = vec4(((
        (
            aScreenCoord.xy
        ) - uScreenScroll) /
            uScreenSize * vec2(2, -2)) + vec2(-1, 1),
        aScreenCoord.z, 1);
    vTextureCoord = aTextureCoord;
}