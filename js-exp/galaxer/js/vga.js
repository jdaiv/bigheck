var VS = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying highp vec2 vTextureCoord;

    void main() {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

var FS = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

var VGA = function () {

    var self = this

    // cosmetics
    var scale = 1
    var scanlines = true
    // --

    // display modes
    var modes = [
        {
            width: 160,
            height: 120,
            scale: 4,
            text: false
        },
        {
            width: 320,
            height: 240,
            scale: 2,
            text: false
        },
        {
            width: 640,
            height: 480,
            scale: 1,
            text: false
        },
        {
            width: 1280,
            height: 960,
            scale: 0.5,
            text: false
        },
        {
            width: 320,
            height: 240,
            scale: 2,
            text: true
        },
        {
            width: 640,
            height: 480,
            scale: 1,
            text: true
        },
    ]
    var mode = modes[1]
    self.width = mode.width
    self.height = mode.height
    // --

    // font
    var font_img = document.getElementById('font')
    var font = make_canvas(font_img.width, font_img.height)
    font.ctx.drawImage(font_img, 0, 0)
    // --

    // canvas
    self.main = make_canvas(mode.width, mode.height)
    // quick shortcut
    self.ctx = self.main.ctx
    self.overlay = make_canvas(mode.width, mode.height)
    var display = make_canvas(mode.width * mode.scale * scale,
        mode.height * mode.scale * scale, 'webgl')
    var display_tex = make_canvas(mode.width * mode.scale * scale,
        mode.height * mode.scale * scale)
    display_tex.ctx.imageSmoothingEnabled = false

    var container_div = document.createElement('div')
    document.body.append(container_div)
    container_div.append(display.canvas)
    container_div.style.paddingLeft = '20px'
    container_div.style.paddingTop = '20px'
    display.canvas.style.width = display.width + 'px'
    display.canvas.style.height = display.height + 'px'
    var gl = display.ctx

    var vs = load_shader(gl.VERTEX_SHADER, VS)
    var fs = load_shader(gl.FRAGMENT_SHADER, FS)
    var shader_prog = gl.createProgram()
    gl.attachShader(shader_prog, vs)
    gl.attachShader(shader_prog, fs)
    gl.linkProgram(shader_prog)

    if (!gl.getProgramParameter(shader_prog, gl.LINK_STATUS)) {
        console.error('Unable to init shader program: ' + gl.getProgramInfoLog(shader_prog))
    }

    var vert_pos = gl.getAttribLocation(shader_prog, 'aVertexPosition')
    var tex_coords = gl.getAttribLocation(shader_prog, 'aTextureCoord')
    var sampler = gl.getUniformLocation(shader_prog, 'uSampler')

    var screen_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, screen_buffer)
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([
            -1,  1,
             1,  1,
             1, -1,
            -1,  1,
             1, -1,
            -1, -1,
        ]),gl.STATIC_DRAW)

    gl.vertexAttribPointer(vert_pos, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vert_pos)

    var screen_tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, screen_tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, display_tex.canvas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    var tex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(tex_coords, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(tex_coords)
    // --

    // public methods
    self.set_mode = function (idx) {
        mode = modes[idx]
        self.width = mode.width
        self.height = mode.height

        set_size(self.main, mode.width, mode.height)
        set_size(self.overlay, mode.width, mode.height)
    }

    self.present = function () {

        display_tex.ctx.clearRect(0, 0, display_tex.width, display_tex.height)
        display_tex.ctx.drawImage(self.main.canvas, 0, 0, self.width, self.height,
            0, 0, display_tex.width, display_tex.height)
        display_tex.ctx.drawImage(self.overlay.canvas, 0, 0, self.width, self.height,
            0, 0, display_tex.width, display_tex.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(shader_prog)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, screen_tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, display_tex.canvas)
        gl.uniform1i(sampler, 0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    self.clear = function () {
        self.ctx.fillStyle = '#000'
        self.ctx.fillRect(0, 0, self.width, self.height)
    }

    self.clear_overlay = function () {
        self.overlay.ctx.clearRect(0, 0, self.width, self.height)
    }

    // eugh
    self.text = function (str, x, y, wrap) {
        self._text(self.ctx, str, x, y, wrap)
    }
    self._text = function (ctx, str, x, y, wrap) {
        var length = str.length
        var __x = x
        var __y = y
        var lines = 1
        for (var i = 0; i < length; i++) {
            var char = str.charCodeAt(i)
            var _x = char % 16
            var _y = (char - _x) / 16
            _x = _x * 9 + 1
            _y = _y * 9 + 1
            if (wrap && __x + 8 + 4 > self.width) {
                __x = x
                __y += 10
                lines++
            }
            ctx.drawImage(font.canvas, _x, _y, 8, 8, __x, __y, 8, 8)
            __x += 8
        }
        return lines
    }

    self.text_color = function (color) {
        font.ctx.globalCompositeOperation = 'source-in'
        font.ctx.fillStyle = color
        font.ctx.fillRect(0, 0, 145, 145)
    }
    // --

    // helper functions
    function make_canvas (width, height, type) {
        var canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        var ctx = canvas.getContext(type || '2d')
        return {
            canvas: canvas,
            ctx: ctx,
            width: width,
            height: height
        }
    }

    function set_size(canvas, width, height) {
        canvas.canvas.width = width
        canvas.canvas.height = height
        canvas.width = width
        canvas.height = height
    }

    function load_shader(type, source) {
        var shader = gl.createShader(type)

        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ' + gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }
        return shader
    }
    // --

    return self

}