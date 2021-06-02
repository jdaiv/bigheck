const eps = -0.00002

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// https://twitter.com/lorenschmidt/status/1018140409057464321
var RNG = {
    a: 1664525,
    c: 1013904223,
    seed: Math.floor(Math.random() * 10000),
    d: function ( ) {
        RNG.seed = (RNG.a * RNG.seed + RNG.c) % 982451497
        return RNG.seed
    }
}

var numPoints = 10
var points = []

var connections = []

function draw () {
    var width = canvas.width
    var height = canvas.height
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.lineJoin = 'round'
    ctx.strokeStyle = ctx.fillStyle = '#0f0'
    ctx.save()
    ctx.translate(Math.floor(width / 2), Math.floor(height / 2))
    for (var i = 0; i < numPoints; i++) {
        points.push({
            x: RNG.d() % 500 - 250,
            y: RNG.d() % 500 - 250
        })
    }

    for (var i = 0; i < numPoints - 1; i++) {
        for (var j = 1; j <= numPoints; j++) {
            if (try_join(points[i], points[(i + j) % numPoints])) break
        }
    }

    points.forEach((p, i) => {
        ctx.fillRect(p.x - 4, p.y - 4, 9, 9)
        // points.forEach(p2 => try_join(p, p2))
    })

    ctx.restore()
}

function try_join (p1, p2, force) {
    if (p1 == p2) return false
    if (!force) {
        var intersect = (RNG.d() % 2 == 1)
        connections.forEach(c => {
            if (segment_intersection(
                p1.x,p1.y,p2.x,p2.y,
                c.p1.x,c.p1.y,c.p2.x,c.p2.y
            ) !== false) {
                intersect = true
                return false
            }
        })
        if (intersect) {
            return false
        }
    }
    var c = {
        p1: p1,
        p2: p2
    }
    ctx.moveTo(c.p1.x, c.p1.y)
    ctx.lineTo(c.p2.x, c.p2.y)
    ctx.stroke()
    connections.push(c)
    return true
}

draw()

// Adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
function between(a, b, c) {
    return a-eps <= b && b <= c+eps;
}
function segment_intersection(x1,y1,x2,y2,x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!between(x2, x, x1)) {return false;}
        } else {
            if (!between(x1, x, x2)) {return false;}
        }
        if (y1>=y2) {
            if (!between(y2, y, y1)) {return false;}
        } else {
            if (!between(y1, y, y2)) {return false;}
        }
        if (x3>=x4) {
            if (!between(x4, x, x3)) {return false;}
        } else {
            if (!between(x3, x, x4)) {return false;}
        }
        if (y3>=y4) {
            if (!between(y4, y, y3)) {return false;}
        } else {
            if (!between(y3, y, y4)) {return false;}
        }
    }
    return {x: x, y: y};
}