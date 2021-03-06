
/* Let's write a material manager with no clue of how to do it! */

const MATERIALS = {
    sectionBg: {
        vs: 'default_vs',
        fs: 'default_fs'
    },
    flag: {
        vs: 'flag_vs',
        fs: 'flag_fs'
    },
    defaultPost: {
        vs: 'default_post_vs',
        fs: 'default_post_fs'
    },
    imageThres: {
        vs: 'default_vs',
        fs: 'image_fs'
    }
}

const DEFAULT_ATTRIBUTES = [
    {
        name: 'aScreenCoord',
        type: 'f',
        length: 3
    },
    {
        name: 'aTextureCoord',
        type: 'f',
        length: 2
    }
]

const DEFAULT_UNIFORMS = [
    {
        name: 'uTime',
        type: 'f',
        precision: 'highp',
        length: 1,
        value: () => GLRenderer.t
    },
    {
        name: 'uColor',
        type: 'f',
        length: 4,
        fsOnly: true
    },
    {
        name: 'uSampler',
        type: 'sampler2D',
        length: 1,
        value: () => 0,
        fsOnly: true
    },
    {
        name: 'uPalette',
        type: 'sampler2D',
        length: 1,
        value: () => 1,
        fsOnly: true
    },
    {
        name: 'uImagePalette',
        type: 'f',
        array: true,
        length: 5,
        value: () => {return ThemeManager.current.imagePalette.map(x => Math.floor(x + App.paletteOffset) % 32)},
        fsOnly: true
    },
    {
        name: 'uScreenSize',
        type: 'f',
        precision: 'mediump',
        length: 2,
        value: () => [GLRenderer.width, GLRenderer.height]
    },
    {
        name: 'uScreenScroll',
        type: 'f',
        precision: 'mediump',
        length: 2,
        value: () => [Math.floor(window.scrollX / 2), Math.floor(window.scrollY / 2)]
    }
]

class MaterialManager {

    static load () {
        console.log('loading materials')
        MaterialManager.generateDefaultHeaders()
        this.materials = []
        for (let key in MATERIALS) {
            console.log('reading material:', key)
            this.materials[key] = new Material(MATERIALS[key])
        }
    }

    static generateDefaultHeaders () {
        MaterialManager.defaultVSHeader = 'precision mediump float;\n'
        MaterialManager.defaultFSHeader = 'precision highp float;\n'

        function getType (d) {
            switch (d.type) {
                case 'i':
                    if (d.length > 1 && !d.array) return 'ivec' + d.length
                    return 'int'
                case 'f':
                    if (d.length > 1 && !d.array) return 'vec' + d.length
                    return 'float'
                default:
                    return d.type
            }
        }

        DEFAULT_ATTRIBUTES.forEach(a => {
            MaterialManager.defaultVSHeader +=
                `attribute ${getType(a)} ${a.name};\n`
        })
        DEFAULT_UNIFORMS.forEach(u => {
            const precision = u.precision || ''
            const str = `uniform ${precision} ${getType(u)} ${u.name + (u.array ? `[${u.length}]` : '')};\n`
            MaterialManager.defaultFSHeader += str
            if (!u.fsOnly) MaterialManager.defaultVSHeader += str
        })
    }

}

class Material {

    constructor (data) {
        this.data = data
        this.linkShader()

        this.attributes = {}
        this.uniforms = {}
        DEFAULT_ATTRIBUTES.forEach(a => this.addAttribute(a))
        DEFAULT_UNIFORMS.forEach(u => this.addUniform(u))
    }

    use () {
        gl.useProgram(this.program)
    }

    addAttribute (a) {
        const location = gl.getAttribLocation(this.program, a.name)
        gl.enableVertexAttribArray(location)
        this.attributes[a.name] = {
            location: location,
            set: function (length) {
                gl.vertexAttribPointer(location, length, gl.FLOAT, false, 0, 0)
            }
        }
    }

    addUniform (u) {
        const location = gl.getUniformLocation(this.program, u.name)
        const type = u.type == 'sampler2D' ? 'i' : u.type
        const func = gl['uniform' + (u.array ? 1 : u.length) + type + (u.length > 1 || u.array ? 'v' : '')]
        this.uniforms[u.name] = {
            location: location,
            set: func.bind(gl, location)
        }
    }

    setUniforms () {
        DEFAULT_UNIFORMS.forEach(u => {
            if (u.value) {
                this.uniforms[u.name].set(u.value())
            }
        })
    }

    linkShader () {
        this.vs = this.load(gl.VERTEX_SHADER,
            MaterialManager.defaultVSHeader +
            ResourceManager.shaders[this.data.vs])
        this.fs = this.load(gl.FRAGMENT_SHADER,
            MaterialManager.defaultFSHeader +
            ResourceManager.shaders[this.data.fs])

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
    }

    load(type, source) {
        var shader = gl.createShader(type)

        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(source)
            console.error('Error compiling shader: ' +
                gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }
        return shader
    }

}