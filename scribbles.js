const SPRITES = {
    dude: {
        src: '/img/dude.png',
        width: 32,
        height: 32,
        origin: {
            x: 16,
            y: 32
        },
        frames: 5,
    },
    train: {
        src: '/img/train.png',
        width: 128,
        height: 32,
        origin: {
            x: 0,
            y: 32
        },
        frames: 2,
    },
    puff: {
        src: '/img/puff.png',
        width: 8,
        height: 8,
        origin: {
            x: 4,
            y: 4
        },
        frames: 6,
    },
}

var SPRITE_IMAGES = {}
var dude
var railroad

var myBoy = {
    state: 'idle',
    timer: 0,
    position: {
        x: 100, y: 0
    },
    velocity: {
        x: 0, y: 0
    },
    facing: 0 // 0 = right, 1 = left
}

var train = {
    position: -SPRITES.train.width,
    particles: [],
    nextParticle: 0
}

// main functions

function init () {
    for (let s in SPRITES) {
        let img = new Image()
        img.src = SPRITES[s].src
        SPRITE_IMAGES[s] = img
        // document.body.appendChild(img)
        // we'd care about the loading status normally, but these are tiny and
        // kinda unimportant really
    }

    dude = loadCanvas('#my-boy', 96, 2)
    railroad = loadCanvas('#railroad', 48, 2)

    window.addEventListener('resize', resize)
    window.requestAnimationFrame(run)
}

var prevT = -1
function run (t) {
    // no ones likes ms
    t = t / 1000

    if (prevT < 0) prevT = t
    let dt = t - prevT

    clearCanvas(dude)

    let dudeFrame = 0
    switch (myBoy.state) {
        case 'idle':
            dudeFrame = myBoy.facing == 0 ? 0 : 2
            break
        case 'walking':
            myBoy.facing = myBoy.velocity.x < 0 ? 1 : 0

            if (myBoy.facing == 0) {
                dudeFrame = Math.sin(t * 20) > 0 ? 1 : 0
            } else {
                dudeFrame = Math.sin(t * 20) > 0 ? 3 : 2
            }
            break
        case 'jumping':
            if (myBoy.facing == 0) {
                dudeFrame = myBoy.position.y > 0 ? 5 : 4
            } else {
                dudeFrame = myBoy.position.y > 0 ? 7 : 6
            }
            break
    }

    function jump () {
        myBoy.timer = t + Math.random() * 1 + 1.5
        myBoy.state = 'jumping'
        setTimeout(() => {
            myBoy.velocity.y = 100
        }, 500)
    }

    if (myBoy.timer < t) {
        myBoy.timer = t + Math.random() * 2 + 1
        myBoy.velocity.x = 0
        switch (myBoy.state) {
            case 'idle':
                if (Math.random() > 0.8) {
                    jump()
                } else {
                    myBoy.state = 'walking'
                    myBoy.velocity.x = Math.random() < 0.5 ? -20 : 20
                }
                break
            case 'walking':
                if (Math.random() > 0.7) {
                    jump()
                } else {
                    myBoy.state = 'idle'
                }
                break
            case 'jumping':
                myBoy.state = 'idle'
                break
        }
    }

    myBoy.position.x += myBoy.velocity.x * dt
    myBoy.position.y += myBoy.velocity.y * dt

    if (myBoy.position.x < 10) {
        myBoy.position.x = 10
        myBoy.velocity.x = -myBoy.velocity.x
    }

    if (myBoy.position.x > dude.width - 10) {
        myBoy.position.x = dude.width - 10
        myBoy.velocity.x = -myBoy.velocity.x
    }

    if (myBoy.position.y > 0) {
        myBoy.velocity.y -= 400 * dt
    } else {
        myBoy.velocity.y = 0
        myBoy.position.y = 0
    }

    drawSprite(dude, 'dude', myBoy.position.x,
        dude.height - 10 - myBoy.position.y, dudeFrame)

    clearCanvas(railroad)

    const puffOffset = { x: 120, y: 10 }
    const trainWidth = SPRITES.train.width
    train.position += 30 * dt
    if (train.position > railroad.width + trainWidth) {
        train.position = -trainWidth
    }

    if (t > train.nextParticle) {
        train.nextParticle = t + Math.random() / 4 - 0.1
        let particle
        train.particles.forEach((p) => {
            if (!p.active) {
                particle = p
                return false
            }
        })
        if (!particle) {
            particle = {}
            train.particles.push(particle)
        }
        particle.active = true
        particle.position = {
            x: train.position - SPRITES.train.origin.x + puffOffset.x,
            y: railroad.height - SPRITES.train.origin.y + puffOffset.y
        }
        particle.velocity = {
            x: -Math.random() / 2 - 0.1,
            y: -Math.random() / 2 - 1.6,
            f: Math.random() / 20 + 0.01
        }
        particle.frame = 1
    }

    train.particles.forEach((p) => {
        if (!p.active) return
        p.position.x += p.velocity.x
        p.position.y += p.velocity.y
        p.frame += p.velocity.f

        if (p.velocity.y < -0.05) {
            p.velocity.y += 8 * dt
        } else {
            p.velocity.y = -0.05
        }

        if (p.velocity.x < -0.2) {
            p.velocity.x += 0.2 * dt
        } else {
            p.velocity.x = -0.2
        }
        if (p.frame > 5) {
            p.active = false
            return
        }

        drawSprite(railroad, 'puff', p.position.x,
            p.position.y, Math.floor(p.frame))
    })

    drawSprite(railroad, 'train', train.position,
        railroad.height, Math.sin(t * 80) > 0 ? 1 : 0)



    prevT = t
    window.requestAnimationFrame(run)
}

function resize () {
    resizeCanvas(dude)
    resizeCanvas(railroad)
}

// helper functions

function loadCanvas (query, height, scale) {
    let el = document.querySelector(query)
    let canvas = document.createElement('canvas')
    canvas.height = Math.floor(height)
    canvas.style.height = canvas.height * scale + 'px'
    el.appendChild(canvas)
    let ret = {
        el: el,
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        scale: scale,
        width: 100,
        height: height
    }
    ret.ctx.imageSmoothingEnabled = false
    resizeCanvas(ret)
    return ret
}

function clearCanvas (c) {
    c.ctx.clearRect(0, 0, c.width, c.height)
}

function resizeCanvas (c) {
    let box = c.el.getBoundingClientRect()
    c.width = c.canvas.width = Math.floor(box.width / c.scale)
    c.canvas.style.width = c.canvas.width * c.scale + 'px'
}

function drawSprite (target, sprite, x, y, frame) {
    if (SPRITE_IMAGES[sprite].complete !== true) return

    x = Math.floor(x)
    y = Math.floor(y)

    let spriteData = SPRITES[sprite]
    let offsetX = spriteData.width * frame

    target.ctx.drawImage(SPRITE_IMAGES[sprite],
        offsetX, 0, spriteData.width, spriteData.height,
        x - spriteData.origin.x, y - spriteData.origin.y,
        spriteData.width, spriteData.height)
}

// -- start the thing!

window.addEventListener('load', init)