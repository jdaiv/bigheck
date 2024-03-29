const theme = document.querySelector('#ui_theme')
const canvas = document.querySelector('#bg')
const ctx = canvas.getContext('2d')
const container = document.querySelector('.container')
let resize = true
let dirty = true
let rainbows = false

canvas.imageSmoothingEnabled = false

function rect (el) {
    const r = el.getBoundingClientRect()
    return {
        x: Math.round((r.left) / 2),
        y: Math.round((r.top) / 2),
        width: Math.round((r.width) / 2),
        height: Math.round((r.height) / 2)
    }
}

function draw (t) {
    if (resize) {
        canvas.width = Math.floor(window.innerWidth / 2)
        canvas.height = Math.floor(window.innerHeight / 2)
        canvas.style.width = canvas.width * 2 + 'px'
        canvas.style.height = canvas.height * 2 + 'px'

        dirty = true
        resize = false
    }

    if (rainbows) {
        ctx.drawImage(canvas,
           0, 0, canvas.width, canvas.height,
           Math.sin(t / 400) * 5, Math.cos(t / 100) * 5, canvas.width, canvas.height)
    }

    if (dirty) {
        if (!rainbows) ctx.clearRect(0, 0, canvas.width, canvas.height)
        const name = document.querySelector('.name')
        drawBanner(rect(name), t)
        const sections = document.querySelectorAll('section')
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i]
            drawRect(rect(section))
        }
        // dirty = false
    }

    if (rainbows) {
        const v = 20
        for (var x = 0; x < canvas.width; x += v) {
            ctx.drawImage(canvas,
               x, 0, v, canvas.height,
               x, Math.cos((x + t) / 100) * v / 4, v, canvas.height)
        }
        for (var y = 0; y < canvas.height; y += v) {
            ctx.drawImage(canvas,
               0, y, canvas.width, v,
               Math.sin((y + t) / 300) * v / 4, y, canvas.width, v)
        }

        ctx.globalCompositeOperation = 'overlay'
        ctx.fillStyle = `hsl(${t / 10 % 360}, 50%, 50%)`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
    }

    window.requestAnimationFrame(draw)
}

function drawBanner (r, t) {
    var cr = rect(container)

    ctx.save()
    ctx.translate(cr.x, r.y)

    t /= 400

    function yOffset (x) {
        return Math.round(
            Math.sin(t + x / 10) * 2 +
            Math.sin(t + x / 20) * 1)
    }

    const PADDING = 10
    const LINE_WIDTH = 5
    const ANGLE = 8

    ctx.lineWidth = 1
    ctx.strokeStyle = '#fee761'

    function drawLine (x, y) {
        ctx.fillRect(x, y, LINE_WIDTH, r.height)
        ctx.strokeRect(x, y + 3, LINE_WIDTH, 0)
        ctx.strokeRect(x, y + r.height - 3, LINE_WIDTH, 0)
    }

    ctx.fillStyle = '#9e2835'
    const start = ((PADDING + 50) / ANGLE) * 2 - 2
    for (var x = PADDING + 50 - LINE_WIDTH; x >= PADDING - LINE_WIDTH; x -= LINE_WIDTH) {
        drawLine(x,
            yOffset(x) + start - Math.floor(x / ANGLE))
    }

    ctx.fillStyle = '#3f2832'
    for (var x = PADDING * 2; x < PADDING + 50; x += LINE_WIDTH) {
        drawLine(x, yOffset(x) + Math.floor(x / ANGLE) + 1)
    }

    ctx.fillStyle = '#e43b44'
    for (var x = PADDING + LINE_WIDTH; x < cr.width - PADDING; x += LINE_WIDTH) {
        drawLine(x, yOffset(x))
    }

    ctx.stroke()
    ctx.fill()

    ctx.restore()
}

function rand (n) {
    return Math.random() * (n * 2) - n
}

function randColor () {
    return `hsl(${Math.random() * 360}, 50%, 50%)`
}

function drawRect (r) {
    ctx.save()
    ctx.translate(r.x, r.y)

    const centerX = Math.floor(r.width / 2)

    // top left
    ctx.drawImage(theme,
       0, 0, 30, 30,
       0, 0, 30, 30)

    // top right
    ctx.drawImage(theme,
       34, 0, 30, 30,
       r.width - 30, 0, 30, 30)

    // bottom left
    ctx.drawImage(theme,
       0, 34, 8, 30,
       0, r.height - 30, 8, 30)

    // bottom right
    ctx.drawImage(theme,
       56, 34, 8, 30,
       r.width - 8, r.height - 30, 8, 30)

    // top edge
    ctx.drawImage(theme,
       30, 0, 4, 30,
       30, 0, r.width - 60, 30)

    // bottom edge
    ctx.drawImage(theme,
       8, 34, 2, 30,
       8, r.height - 30, r.width - 16, 30)

    // bottom dec
    ctx.drawImage(theme,
       12, 34, 40, 30,
       centerX - 20, r.height - 30, 40, 30)

    // left edge
    ctx.drawImage(theme,
       0, 30, 30, 4,
       0, 30, 30, r.height - 60)

    // right edge
    ctx.drawImage(theme,
       34, 30, 30, 4,
       r.width - 30, 30, 30, r.height - 60)

    // center
    ctx.drawImage(theme,
       34, 34, 4, 4,
       30, 30, r.width - 60, r.height - 60)

    ctx.restore()
}

draw()

window.onresize = function () {
    resize = true
}

window.onscroll = function () {
    dirty = true
}