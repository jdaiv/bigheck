
class SectionBG {

    constructor (el) {
        this.element = el
        this.glObj = new GLObject2D(MaterialManager.materials.sectionBg)
        this.resize()
    }

    resize () {
        const t = ThemeManager.current
        this.glObj.setTexture(ResourceManager.images[t.image])

        const r = rect(this.element)
        const centerX = Math.floor(r.width / 2)
        let triangles = []
        let uvs = []
        let y = 0

        function box (height, start, end, uv0, uv1, uv2, uv3) {
            start += r.x
            end += r.x
            let _y = y + r.y
            triangles.push(
                start, _y,
                end, _y,
                start, _y + height,
                end, _y,
                end, _y + height,
                start, _y + height
            )
            uvs.push(uv0[0], uv0[1], uv1[0], uv1[1], uv2[0], uv2[1],
                uv1[0], uv1[1], uv3[0], uv3[1], uv2[0], uv2[1])
        }

        const yUVs = [
            0,
            t.slices[0][0] / t.height,
            (t.height - t.slices[2][0]) / t.height,
            1
        ]

        t.slices.forEach((s, i) => {
            const len = s.length

            let arr = [0, s[2]]
            let arrUVs = [0, s[2]]

            if (len == 9) {
                const midPoint = Math.floor(t.width / 2)
                const left = midPoint - s[4]
                const right = s[5] - midPoint
                arr.push(centerX - left, centerX + right)
                arrUVs.push(s[4], s[5])
            } else if (len == 6) {
                // we good, nothing else to do
            } else {
                throw new Error('unsupported theme slice')
            }

            arr.push(r.width - s[len - 1] + s[len - 2], r.width)
            arrUVs.push(s[len - 2], s[len - 1])

            const _arrUVs = arrUVs.map(u => u / t.width)

            const uvTop = yUVs[i]
            const uvBottom = yUVs[i + 1]

            let height = 0
            if (i != 1) {
                height = s[0]
                const mode = s[3]
                for (let x = 0; x < arr.length; x++) {
                    if (x % 2 == 1 && mode == REPEAT) {
                        const width = arrUVs[x + 1] - arrUVs[x]
                        let _x = arr[x]
                        let uvEnd = _arrUVs[x + 1]
                        for (let _i = 0; _x < arr[x + 1] - width; _x += width, _i++) {
                            let _uvStart = _i % 2 == 0 && t.repeatFlip ? uvEnd : _arrUVs[x]
                            let _uvEnd = _i % 2 == 0 && t.repeatFlip ? _arrUVs[x] : uvEnd
                            box(height, _x, _x + width,
                                [_uvStart, uvTop], [_uvEnd, uvTop],
                                [_uvStart, uvBottom], [_uvEnd, uvBottom])
                        }
                        // uvEnd = _arrUVs[x + 1] - (arr[x + 1] -_x) / t.width
                        box(height, _x, arr[x + 1],
                            [_arrUVs[x], uvTop], [uvEnd, uvTop],
                            [_arrUVs[x], uvBottom], [uvEnd, uvBottom])
                    } else {
                        box(height, arr[x], arr[x + 1],
                            [_arrUVs[x], uvTop], [_arrUVs[x + 1], uvTop],
                            [_arrUVs[x], uvBottom], [_arrUVs[x + 1], uvBottom])
                    }
                }
            } else {
                const mode = s[0]
                height = r.height - t.slices[0][0] - t.slices[2][0]

                if (mode == REPEAT) {
                    const originalY = y
                    const targetY = y + height
                    let _height = t.height - t.slices[2][0] - t.slices[0][0]
                    for (let _i = 0; y < targetY; y += _height, _i++) {
                        let _uvStart = _i % 2 == 0 && t.repeatFlip ? yUVs[2] : yUVs[1]
                        let _uvEnd = _i % 2 == 0 && t.repeatFlip ? yUVs[1] : yUVs[2]
                        if (y + _height >= targetY) {
                            _height = targetY - y
                        }
                        for (let x = 0; x < arr.length; x++) {
                            box(_height, arr[x], arr[x + 1],
                                [_arrUVs[x], _uvStart], [_arrUVs[x + 1], _uvStart],
                                [_arrUVs[x], _uvEnd], [_arrUVs[x + 1], _uvEnd])
                        }
                    }
                    y = originalY
                } else {
                    for (let x = 0; x < arr.length; x++) {
                        box(height, arr[x], arr[x + 1],
                            [_arrUVs[x], uvTop], [_arrUVs[x + 1], uvTop],
                            [_arrUVs[x], uvBottom], [_arrUVs[x + 1], uvBottom])
                    }
                }
            }

            y += height
        })
        this.glObj.setUVs(uvs)
        this.glObj.setVerts(triangles)
    }

    draw () {
        this.glObj.draw()
    }

}

class Flag {

    constructor (el) {
        this.element = el
        this.material = MaterialManager.materials.flag
        this.layers = [
            new GLObject2D(this.material),
            new GLObject2D(this.material),
            new GLObject2D(this.material)
        ]
        this.resize()
    }

    resize () {
        this.layers[0].color = ThemeManager.current.flag[0]
        this.layers[1].color = ThemeManager.current.flag[1]
        this.layers[2].color = ThemeManager.current.flag[2]

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
        this.layers.forEach((l, idx) => {
            l.draw()
        })
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