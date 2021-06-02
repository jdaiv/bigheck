varying highp vec2 vTextureCoord;

vec2 getScreenCoords(vec2 uv) {
    return vec2(uv.x, 1.0 - uv.y) * uScreenSize - uScreenScroll;
}

vec2 getUV(vec2 screenCoord) {
    vec2 uv = (screenCoord + uScreenScroll) /  uScreenSize;
    return vec2(uv.x, 1.0 - uv.y);
}

const float shadowSize = 10.0;

void main() {
    vec2 screenCoords = getScreenCoords(vTextureCoord);
    // vec2 texCoord = vec2(
    //     (screenCoords.x + sin(uTime / 200.0 + screenCoords.y / 10.0) * 2.0),
    //     (screenCoords.y + sin(uTime / 100.0 + screenCoords.x / 20.0) * 2.0)
    // );
    vec4 color = texture2D(uSampler, vTextureCoord);

    // really dirt drop shadow
    if (color.w <= 0.0) {
        vec4 next = texture2D(uSampler, getUV(screenCoords - vec2(4)));
        if (next.w >= 0.1) {
            color = vec4(0, 0, 0, 0.5);
        }
    }

    gl_FragColor = color;
}