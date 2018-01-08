var PRG_CHAR_ANIM_TEST = function () {
    var d, s

    var self = this
    self.name = 'CHARMAP'

    self.keydown = function (evt) {
        s.next_program = new PRG_BOOT()
    }

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    var ground = 100

    var t = 0
    var c = {
        width: 16,
        body: 12,
        legs: 8,
        leg_width: 4,
        bounce: 0,
        rotation: -1,
        rotation_2: -1,
    }

    self.loop = function (dt) {
        t += dt
        c.bounce = Math.abs(Math.sin(t * 8) * 4)
        c.rotation = Math.sin(t * 8) / 1.2
        c.rotation_2 = Math.cos(t * 8) / 1.2
    }

    self.draw = function () {
        d.clear()

        // move to the bottom left corner
        d.ctx.save()
        d.ctx.translate(100, 100)

        // ground
        d.ctx.fillStyle = 'rgb(0, 50 , 0)'
        d.ctx.fillRect(-100, 0, d.width, 4)

        d.ctx.translate(0, -c.bounce)

        var w_2 = c.width / 2

        // body
        d.ctx.fillStyle = 'rgb(0, 175, 0)'
        var body_rot = Math.abs(c.rotation_2) * c.width / 2
        var body_width = c.width - (body_rot)
        d.ctx.fillRect(body_rot / 2, -c.legs - c.body, body_width, c.body)

        // right leg
        var right_leg_height = c.legs - Math.abs(Math.cos(t * 4)) * c.legs / 2
        d.ctx.fillStyle = 'rgb(0, 125, 0)'
        d.ctx.fillRect((w_2 - c.leg_width / 2) - (c.rotation * -1) * (w_2 - c.leg_width / 2),
            -c.legs, c.leg_width, right_leg_height)

        // left leg
        var left_leg_height = c.legs - Math.abs(Math.sin(t * 4)) * c.legs / 2
        d.ctx.fillStyle = 'rgb(0, 175, 0)'
        d.ctx.fillRect((w_2 - c.leg_width / 2) - c.rotation * (w_2 - c.leg_width / 2),
            -c.legs, c.leg_width, left_leg_height)

        d.ctx.restore()

        d.text('ESC to exit', 8, d.height - 16)
    }

    self.exit = function () {

    }

    return self
}

APPS.push(['character animation test', PRG_CHAR_ANIM_TEST])
// startup_prg = new PRG_CHAR_ANIM_TEST()