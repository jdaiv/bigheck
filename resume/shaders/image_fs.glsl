varying highp vec2 vTextureCoord;

vec4 palette (float color) {
    return texture2D(uPalette, vec2(color / 32.0 + 0.5 / 32.0, 0.5));
}

void main () {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.w = 1.0;
    float offset = sin(uTime / 1200.0) / 70.0;
    float brightness = dot(color, vec4(0.25));
    if (brightness > 0.9 + offset) {
        color = palette(uImagePalette[4]);
    } else if (brightness > 0.7 + offset) {
        color = palette(uImagePalette[3]);
    } else if (brightness > 0.6 - offset) {
        color = palette(uImagePalette[2]);
    } else if (brightness > 0.4 + offset) {
        color = palette(uImagePalette[1]);
    } else {
        color = palette(uImagePalette[0]);
    }
    gl_FragColor = color;
}