
const FILL = -1
const NO_FILL = -2
const THEMES = [
    {
        image: 'theme01',
        width: 64,
        height: 64,
        slices: [
            [30,   0, NO_FILL, 30, FILL, 34, NO_FILL, 64],
            [FILL, 0, NO_FILL, 8, FILL, 56, NO_FILL, 64],
            [30,   0, NO_FILL, 8, FILL, 10, NO_FILL, 54, FILL, 56, NO_FILL, 64]
        ]
    }
]

function generateVerts (verts, triangles) {
    let arr = []
    triangles.forEach(t => arr.push(verts[t][0], verts[t][1]))
    return arr
}

function calculateThemeTriangles (t) {
    let tris = []
    let offset = 0
    t.slices.forEach(s => {
        var len = s.length / 2 - 1
        for (let box = 0; box < len; box++) {
            tris.push(
                offset + box + 0, offset + box + 1, offset + box + len + 1,
                offset + box + 1, offset + box + len + 2, offset + box + len + 1
            )
        }
        offset += s.length
    })
    t.triangles = tris
}

function calculateThemeUVs (t) {
    const ts = t.slice
    let uvs = []
    let y = 0
    t.slices.forEach((s, i) => {
        for (let x = 1; x < s.length; x += 2) {
            uvs.push([s[x], y])
        }
        if (s[0] == FILL) {
            y = t.height - t.slices[i + 1][0]
        } else {
            y += s[0]
        }
        for (let x = 1; x < s.length; x += 2) {
            uvs.push([s[x], y])
        }
    })
    uvs.forEach(uv => {
        uv[0] /= t.width
        uv[1] /= t.height
    })
    t.uvs = generateVerts(uvs, t.triangles)
}
THEMES.forEach(t => {
    calculateThemeTriangles(t)
    calculateThemeUVs(t)
})

class SectionBG {

    constructor (el) {
        this.element = el
        this.glObj = new GLObject2D(DEFAULT_SHADER)
        this.glObj.setUVs(THEMES[0].uvs)
        this.glObj.setTexture(new GLTexture(resources.images.theme01))
        this.resize()
    }

    resize () {
        const r = rect(this.element)
        const centerX = Math.floor(r.width / 2)
        const t = THEMES[0]
        let verts = []
        let slices = []
        let y = 0
        t.slices.forEach((s, i) => {
            const len = s.length
            let solids = -2
            for (let i = 2; i < len; i += 2) {
                if (s[i] == NO_FILL) solids++
            }

            let arr = []

            const innerEdge = s[3]
            const outerEdge = r.width - s[len - 1] + s[len - 3]

            arr.push(s[1])
            arr.push(innerEdge)

            if (solids > 0) {
                const width = Math.floor(outerEdge - innerEdge)
                const segmentWidth = Math.floor(width / (solids + 1))
                for (let i = 1; i <= solids; i++) {
                    const start = s[3 + i * 2]
                    const end = s[5 + i * 2]
                    const midPoint = Math.floor((end - start) / 2)
                    const x = (innerEdge + segmentWidth * i)
                    arr.push(x - midPoint, x + midPoint)
                }
            }

            arr.push(outerEdge)
            arr.push(r.width)

            arr.forEach(x => {
                verts.push([x + r.x, y + r.y])
            })
            if (s[0] == FILL) {
                y = r.height - t.slices[i + 1][0]
            } else {
                y += s[0]
            }
            arr.forEach(x => {
                verts.push([x + r.x, y + r.y])
            })
        })
        this.glObj.setVerts(generateVerts(verts, t.triangles))
    }

    draw () {
        this.glObj.draw()
    }

}

class Flag {

    constructor (el) {
        this.element = el
        this.shader = new GLShader({
            vs: WAVEY_VS, fs: FLAT_FS
        })
        this.layers = [
            new GLObject2D(this.shader),
            new GLObject2D(this.shader),
            new GLObject2D(this.shader)
        ]
        this.layers[0].color = [0x9e / 0xFF, 0x28 / 0xFF, 0x35 / 0xFF, 1]
        this.layers[1].color = [0x3f / 0xFF, 0x28 / 0xFF, 0x32 / 0xFF, 1]
        this.layers[2].color = [0xe4 / 0xFF, 0x3b / 0xFF, 0x44 / 0xFF, 1]
        this.resize()
    }

    resize () {
        const r = rect(this.element)
        const hr = rect(this.element.querySelector('h1'))

        const PADDING = -2
        const LINE_WIDTH = 4
        const ANGLE = LINE_WIDTH * 0.2

        let triangles = [[], [], []]
        let uvs = [[], [], []]
        let verts = [[], [], []]
        let offset = [-2, -2, -2]

        function drawLine (l, x, y) {
            verts[l].push(
                [r.x + x, hr.y + y],
                [r.x + x, hr.y + y + hr.height])
            uvs[l].push([0.1, 0], [0.1, 1])
            let o = offset[l]
            if (o >= 0) {
                triangles[l].push(o + 0, o + 1, o + 2, o + 1, o + 3, o + 2)
            }
            offset[l] += 2
        }

        const start = ((PADDING + 50) / ANGLE) * 2 - 2
        let x = PADDING
        let y = 0
        for (x = PADDING + LINE_WIDTH; x <= r.width; x += LINE_WIDTH) {
            drawLine(2, x, y)
        }
        drawLine(2, x, y)
        for (x = PADDING + LINE_WIDTH; x <= PADDING + 50; x += LINE_WIDTH) {
            drawLine(1, x, y)
            y += ANGLE
        }
        drawLine(1, x, y)
        for (; x >= PADDING + LINE_WIDTH; x -= LINE_WIDTH) {
            drawLine(0, x, y)
            y += ANGLE
        }
        drawLine(0, x, y)

        for (let i = 0; i < 3; i++) {
            this.layers[i].setUVs(generateVerts(uvs[i], triangles[i]))
            this.layers[i].setVerts(generateVerts(verts[i], triangles[i]))
        }

    }

    draw () {
        this.layers.forEach(l => l.draw())
    }

}

function rect (el) {
    const r = el.getBoundingClientRect()
    return {
        x: Math.round((r.left + window.scrollX) / 2),
        y: Math.round((r.top + window.scrollY) / 2),
        width: Math.round((r.width) / 2),
        height: Math.round((r.height) / 2)
    }
}