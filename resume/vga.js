
/* If anyone is reading this, I have no clue what I'm doing.
 * This was an exercise in using WebGL with no guide of any kind.
 */

class VGA {

    constructor () {
        this.canvas = document.createElement('canvas')
        document.body.appendChild(this.canvas)
    }

    init () {
        try {
            GLRenderer.init(this.canvas)
            this.resize()
            return true
        } catch (ex) {
            // alert('Your browser does not support WebGL!')
            console.error(ex)
        }
    }

    resize () {
        const w = this.canvas.width = Math.floor(window.innerWidth / 2)
        const h = this.canvas.height = Math.floor(window.innerHeight / 2)
        this.canvas.style.width = w * 2 + 'px'
        this.canvas.style.height = h * 2 + 'px'
        GLRenderer.width = w
        GLRenderer.height = h
        gl.viewport(0, 0, w, h)
    }

}

class GLRenderer {

    static init (canvas) {
        this.ctx = canvas.getContext('webgl')
        window.gl = this.ctx
        window.DEFAULT_SHADER = new GLShader({
            vs: DEFAULT_VS,
            fs: DEFAULT_FS
        })
    }

    static clear () {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    }

}

class GLShader {

    constructor (data) {
        this.vs = this.load(gl.VERTEX_SHADER, data.vs)
        this.fs = this.load(gl.FRAGMENT_SHADER, data.fs)

        if (this.vs == null || this.fs == null) {
            throw new Error('Error compiling shader')
        }

        this.program = gl.createProgram()
        gl.attachShader(this.program, this.vs)
        gl.attachShader(this.program, this.fs)
        gl.linkProgram(this.program)

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Unable to init shader program: ' +
                gl.getProgramInfoLog(this.program))
            throw new Error('Error linking shader')
        }

        this.attribs = {
            aScreenCoord:
                gl.getAttribLocation(this.program, 'aScreenCoord'),
            aTextureCoord:
                gl.getAttribLocation(this.program, 'aTextureCoord')
        }
        this.uniforms = {
            uScreenSize:
                gl.getUniformLocation(this.program, 'uScreenSize'),
            uScreenScroll:
                gl.getUniformLocation(this.program, 'uScreenScroll'),
            uColor:
                gl.getUniformLocation(this.program, 'uColor'),
            uTime:
                gl.getUniformLocation(this.program, 'uTime'),
            uSampler:
                gl.getUniformLocation(this.program, 'uSampler')
        }
        for (let key in data.attribs) {
            this.attribs[key] = gl.getAttribLocation(this.program, key)
        }
        for (let key in data.uniforms) {
            this.uniforms[key] = gl.getUniformLocation(this.program, key)
        }
    }

    load(type, source) {
        var shader = gl.createShader(type)

        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ' +
                gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }
        return shader
    }

}

class GLTexture {

    constructor (image) {
        this.tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

}

class GLObject2D {

    constructor (shader) {
        this.shader = shader
        this.verts = []
        this.uvs = []
        this.texture = null
    }

    setVerts (verts, mode) {
        this.verts = verts
        this.vertBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.STATIC_DRAW)
        this.mode = mode || 2
    }

    setUVs (uvs) {
        this.uvs = uvs
        this.uvsBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW)
    }

    setTexture (tex) {
        this.texture = tex
    }

    draw () {

        // setup
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer)
        gl.enableVertexAttribArray(this.shader.attribs.aScreenCoord)
        gl.vertexAttribPointer(this.shader.attribs.aScreenCoord,
            this.mode, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.enableVertexAttribArray(this.shader.attribs.aTextureCoord)
        gl.vertexAttribPointer(this.shader.attribs.aTextureCoord,
            2, gl.FLOAT, false, 0, 0)

        gl.useProgram(this.shader.program)
        if (this.texture) {
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.texture.tex)
        }
        gl.uniform2f(this.shader.uniforms.uScreenSize,
            GLRenderer.width, GLRenderer.height)
        gl.uniform2f(this.shader.uniforms.uScreenScroll,
            Math.floor(window.scrollX / 2), Math.floor(window.scrollY / 2))
        gl.uniform1f(this.shader.uniforms.uTime, GLRenderer.t)
        gl.uniform1i(this.shader.uniforms.uSampler, 0)
        if (this.color) {
            gl.uniform4fv(this.shader.uniforms.uColor, this.color)
        }

        // draw it!
        gl.drawArrays(gl.TRIANGLES, 0, this.verts.length / 2)

        // clean up
        gl.disableVertexAttribArray(this.shader.attribs.aVertexPosition)
        gl.disableVertexAttribArray(this.shader.attribs.aTextureCoord)

    }

}

const WAVEY_VS = `
precision mediump float;

uniform highp float uTime;
uniform vec2 uScreenSize;
uniform vec2 uScreenScroll;
attribute vec3 aScreenCoord;
attribute vec2 aTextureCoord;

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
}`

const DEFAULT_VS = `
precision mediump float;

uniform highp float uTime;
uniform vec2 uScreenSize;
uniform vec2 uScreenScroll;
attribute vec3 aScreenCoord;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = vec4(((
        (
            aScreenCoord.xy
        ) - uScreenScroll) /
            uScreenSize * vec2(2, -2)) + vec2(-1, 1),
        aScreenCoord.z, 1);
    vTextureCoord = aTextureCoord;
}`

const FLAT_FS = `
precision highp float;

varying highp vec2 vTextureCoord;

uniform float uTime;
uniform sampler2D uSampler;
uniform vec4 uColor;

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
}`

const DEFAULT_FS = `
precision highp float;

varying highp vec2 vTextureCoord;

uniform float uTime;
uniform sampler2D uSampler;
uniform vec4 uColor;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}`