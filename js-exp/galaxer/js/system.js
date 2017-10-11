var PANIC_EXPRESS = function () {

    var self = this

    var vga = new VGA()
    self.vga = vga
    // var snd = new SND()
    // self.snd = snd

    self.ready = false
    self.error = false
    self.error_location = ''
    self.error_text = ''
    self.current_program = null
    self.next_program = null

    self.init = function () {
        window.requestAnimationFrame(self.loop)
        window.addEventListener('keydown', function (evt) {
            /*if (evt.code == 'Digit0') {
                vga.set_mode(0)
                evt.stopImmediatePropagation()
            } else if (evt.code == 'Digit1') {
                vga.set_mode(1)
                evt.stopImmediatePropagation()
            } else if (evt.code == 'Digit2') {
                vga.set_mode(2)
                evt.stopImmediatePropagation()
            } else if (evt.code == 'Digit3') {
                vga.set_mode(3)
                evt.stopImmediatePropagation()
            } else */if (evt.code == 'Backslash') {
                self.set_error(self.current_program, 'break')
            } else if (self.error && evt.code == 'Escape') {
                self.error = false
                self.current_program = null
                self.next_program = new PRG_SYS()
                vga.clear()
                vga.clear_overlay()
                evt.stopImmediatePropagation()
            }
        })
        self.pass_event('keydown')
        self.pass_event('keyup')
    }

    self.pass_event = function (name) {
        window.addEventListener(name, function (evt) {
            if (evt.preventDefaulted || self.error) {
                return
            }

            if (self.current_program != null &&
                typeof self.current_program[name] == 'function') {
                try {
                    self.current_program[name](evt)
                } catch (e) {
                    console.error(e)
                    self.set_error(self.current_program, e.message)
                }
            }
        });
    }

    var error_slide = 0
    self.set_error = function (prg, msg) {
        self.current_program.exit()
        self.error = true
        self.error_location = prg.name
        self.error_text = msg.toUpperCase()
        error_slide = 0
        vga.clear_overlay()
        vga.text_color('#F00')
        vga.overlay.ctx.fillStyle = '#000'
        vga.overlay.ctx.globalAlpha = 0.2
        vga.overlay.ctx.fillRect(0, 0, vga.width, vga.height)
        vga.overlay.ctx.globalAlpha = 1
        vga.overlay.ctx.fillRect(2, 2, vga.width - 4, 46)
        vga.overlay.ctx.fillStyle = '#f00'
        vga.overlay.ctx.strokeStyle = '#f00'
        vga.overlay.ctx.fillRect(5, 5, 3, 14)
        vga.overlay.ctx.fillRect(5, 22, 3, 3)
        vga.overlay.ctx.strokeRect(2.5, 2.5, 8, 46)
        vga.overlay.ctx.strokeRect(2.5, 2.5, vga.width - 4, 46)
        vga._text(vga.overlay.ctx, 'FATAL ERROR (PRESS ESCAPE TO REBOOT)', 14, 6) // IN PROGRAM ' + self.error_location
        vga._text(vga.overlay.ctx, self.error_text, 14, 16, true)

        vga.ctx.globalAlpha = 1
        var i = 0
        while (i < vga.height) {
            var rand_h = Math.round(Math.random() * 5) + 1
            vga.ctx.globalCompositeOperation = 'hue'
            vga.ctx.fillStyle = 'hsl(' + Math.round(Math.random() * 360) +
                ', 75%, 50%)'
            vga.ctx.fillRect(0, i, vga.width, rand_h)
            var rand_x = Math.round(Math.random() * 4 - 2)
            vga.ctx.globalCompositeOperation = 'source-over'
            vga.ctx.drawImage(vga.main.canvas,
               0, i, vga.width, rand_h,
               rand_x, i, vga.width, rand_h)
            i += rand_h
        }
    }

    self.time = -1
    self.dt = -1
    self.loop = function (t) {
        window.requestAnimationFrame(self.loop)
        if (self.time < 0) {
            self.time = t
            return
        }

        self.dt = (t - self.time) / 1000
        self.time = t

        if (self.error) {
            var slide_amt = 240
            if (error_slide < slide_amt) {
                error_slide++
                vga.ctx.globalCompositeOperation = 'color-dodge'
                var rand_h = Math.round(Math.random() * 5) + 1
                for (var i = 0; i < vga.height; i += rand_h) {
                    var rand_x = Math.round(Math.random() * 4 - 2)
                    // var rand_y = Math.round(Math.random() * vga.height / rand_h) * rand_h
                    var rand_y = i
                    var a = 0.05 * ((slide_amt - error_slide) / slide_amt)
                    vga.ctx.globalAlpha = Math.random() * a + a
                    vga.ctx.drawImage(vga.main.canvas,
                       0, rand_y, vga.width, rand_h,
                       rand_x, rand_y, vga.width, rand_h)
                }
                vga.ctx.globalAlpha = 1
                vga.ctx.globalCompositeOperation = 'source-over'
                for (var x = 0; x < vga.width; x++) {
                    var droop = Math.round((Math.random() * 1 - 0.5) * 1.05 *
                        Math.cos(error_slide / slide_amt * (Math.PI / 2)))
                    vga.ctx.drawImage(vga.main.canvas,
                       x, 0, 1, vga.height,
                       x, droop, 1, vga.height)
                }
            }
            vga.present()
            return
        }

        if (self.current_program != null) {
            try {
                self.current_program.loop(self.dt)
                self.current_program.draw()
            } catch (e) {
                console.error(e)
                self.set_error(self.current_program, e.message)
            }
        }


        vga.present()

        // if we have a new program ready, exit the current one and
        // start the new one
        if (self.next_program != null) {
            try {
                if (self.current_program != null) {
                    self.current_program.exit()
                }
                self.next_program.init(self, vga)
                self.current_program = self.next_program
                self.next_program = null
            } catch (e) {
                console.error(e)
                self.set_error(self.current_program, e.message)
            }
        }
    }

    return self

}

