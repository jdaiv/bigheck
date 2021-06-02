class Tree {

    constructor (depth) {
        this.arr = []
        for (let i = 0; i < depth; i++) {
            this.arr.push(new Array(Math.pow(2, i)))
        }
    }

} 

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const input = document.getElementById('formula')
const form = document.getElementsByTagName('form')[0]

const width = canvas.width
const height = canvas.height
const width_2 = canvas.width / 2
const height_2 = canvas.height / 2

form.onsubmit = function (e) {
    e.preventDefault()
    return false
}

let raf = window.requestAnimationFrame(loop)

const tree = new Tree(4)

let depthMap = new Uint16Array(width * height)
let imageData = new Uint8ClampedArray(width * height * 4)

const MAP_SIZE = 8
const map = new Array(MAP_SIZE * MAP_SIZE)
for (let i = 0; i < map.length; i++) {
    map[i] = Math.max(0.05, Math.random())// / 2 + 0.1
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function getMapPoint(x, y) {
    if (x < 0) {
        x += MAP_SIZE
    }

    if (y < 0) {
        y += MAP_SIZE
    }

    _y = y % 1
    y = Math.trunc(y)
    _x = x % 1
    x = Math.trunc(x)

    if (_y === 0 && _x === 0) {
        return map[y * MAP_SIZE + x]
    }

    const a = lerp(
        map[(y % MAP_SIZE) * MAP_SIZE + x % MAP_SIZE],
        map[(y % MAP_SIZE) * MAP_SIZE + (x + 1) % MAP_SIZE],
        _x)

    const b = lerp(
        map[((y + 1) % MAP_SIZE) * MAP_SIZE + x % MAP_SIZE],
        map[((y + 1) % MAP_SIZE) * MAP_SIZE + (x + 1) % MAP_SIZE],
        _x)

    return lerp(a, b, _y)
}

function loop (_t) {
    ctx.clearRect(0, 0, width, height)
    depthMap.fill(512)
    imageData.fill(0)

    for (let y = 0; y < height; y += 1) {
        const _y = y / height * (MAP_SIZE - 1) + _t / 1000

        const w = width

        for (let x = 0; x <= width; x++) {
            const _x = x / width * (MAP_SIZE - 1) + _t / 1000
            drawTerrain(x, y, getMapPoint(_x, _y) * 64)
        }
    }

    ctx.putImageData(new ImageData(imageData, width, height), 0, 0)

    raf = window.requestAnimationFrame(loop)
}

function drawTerrain(x, y, z) {
    const c = Math.trunc((z / 64) * 200) + 55

    z = Math.trunc(z)
    let _y = height * width - (y + 1) * width - (z * width)
    let offset = (_y + x) * 4
    for (let i = 0; i < z; i++) {
        if (offset >= 0) {
            if (depthMap[_y + x] <= y) break
            depthMap[_y + x] = y
            imageData[offset + 0] = c
            imageData[offset + 1] = c
            imageData[offset + 2] = c
            imageData[offset + 3] = 255
        }
        offset += width * 4
        _y += width
    }
}