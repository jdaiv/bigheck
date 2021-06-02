
/* If anyone is reading this, I have no clue what I'm doing.
 * This was an exercise in using WebGL with no guide of any kind.
 */

class GLRenderer {

    static init () {
        try {
            GLRenderer.canvas = document.createElement('canvas')
            document.body.appendChild(GLRenderer.canvas)
            GLRenderer.ctx = GLRenderer.canvas.getContext('webgl', {
                antialias: false
            })
            window.gl = GLRenderer.ctx
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
            this.resize()
            return true
        } catch (ex) {
            // alert('Your browser does not support WebGL!')
            console.error(ex)
        }
    }

    static clear () {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    }

    static resize () {
        const w = this.canvas.width = Math.floor(window.innerWidth / 2)
        const h = this.canvas.height = Math.floor(window.innerHeight / 2)
        this.canvas.style.width = w * 2 + 'px'
        this.canvas.style.height = h * 2 + 'px'
        GLRenderer.width = w
        GLRenderer.height = h
        gl.viewport(0, 0, w, h)
        if (GLRenderer.fbo) GLRenderer.fbo.resize()
    }

    static preRender () {
        if (!GLRenderer.fbo) {
            console.log('creating framebuffer')
            GLRenderer.fbo = new GLFBO()
        }
        GLRenderer.fbo.bind()
        GLRenderer.clear()
    }

    static present () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        GLRenderer.fbo.render()
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

    constructor (material) {
        this.material = material
        this.verts = []
        this.uvs = []
        this.texture = null
    }

    setVerts (verts, mode) {
        this.verts = verts
        if (this.vertBuffer) gl.deleteBuffer(this.vertBuffer)
        this.vertBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.STATIC_DRAW)
        this.mode = mode || 2
    }

    setUVs (uvs) {
        this.uvs = uvs
        if (this.uvsBuffer) gl.deleteBuffer(this.uvsBuffers)
        this.uvsBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW)
    }

    setTexture (tex) {
        this.texture = tex
    }

    draw () {

        this.material.use()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer)
        this.material.attributes.aScreenCoord.set(this.mode)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer)
        this.material.attributes.aTextureCoord.set(2)

        if (this.texture) {
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.texture.tex)
        }

        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, ResourceManager.images.palette.tex)

        if (this.color) {
            this.material.uniforms.uColor.set(this.color)
        }

        this.material.setUniforms()

        gl.drawArrays(gl.TRIANGLES, 0, this.verts.length / 2)
    }

}

class GLFBO {

    constructor () {
        this.texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        this.buffer = gl.createFramebuffer()
        this.renderObject = new GLObject2D(MaterialManager.materials.defaultPost)
        this.renderObject.setTexture({tex: this.texture})
        this.renderObject.setUVs([
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 0
        ])
        this.resize()
    }

    resize () {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            GLRenderer.width, GLRenderer.height,
            0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        this.renderObject.setVerts([
            -1, 1,
            1, 1,
            -1, -1,
            1, 1,
            1, -1,
            -1, -1
        ])
    }

    bind () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, this.texture, 0);
    }

    render () {
        this.renderObject.draw()
    }

}