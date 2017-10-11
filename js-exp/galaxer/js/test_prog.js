var PRG_RAINBOWS = function () {
    var d, s

    var self = this
    self.name = 'RAINBOWS'

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    self.keydown = function (evt) {
        if (evt.code == 'Escape') {
            s.next_program = new PRG_BOOT()
        } else {
            s.set_error(self, 'unimplemented')
        }
    }

    var counter = 0
    var ram_check = 0
    var t = 0
    var _dt = 0
    self.loop = function (dt) {
        t += dt * 1000
        color_increment(dt * 1000);
        _dt = dt
    }

    self.draw = function () {
        var width = d.width;
        var height = d.height;
        var width_2 = width / 2;
        var height_2 = height / 2;

        // d.clear()

        var steps = 40
        var __dt = _dt / steps
        for (var i = steps - 1; i >= 0; i--) {
            var _t = t - __dt * i
            var x_offset = Math.sin(_t / 200) * 20
            var y_offset = Math.cos(_t / 400) * 20
            // var scale = 1 - (0.012 + Math.cos(_t / 1000) * 0.01) / steps
            var scale = 1 - (0.05 / steps)
            var rotation =  Math.sin(_t / 400) * (0.1 / steps)
            d.ctx.save();
            d.ctx.translate(width_2 + x_offset, height_2 + y_offset);
            d.ctx.rotate(rotation);
            d.ctx.scale(scale, scale);
            d.ctx.drawImage(d.main.canvas, -width_2 - x_offset, -height_2 - y_offset);
            d.ctx.restore();
        }

        var x_pos = 0;
        var box_size = 8;

        color_set_fill(1, 0.5);
        d.ctx.fillRect(x_pos, 0, width, box_size);
        d.ctx.fillRect(0, x_pos, box_size, height);
        color_set_fill_i(1, 0.5);
        d.ctx.fillRect(x_pos, height - box_size, width, box_size);
        d.ctx.fillRect(width - box_size , x_pos, box_size, height);

        d.text_color('#000')
        var text_x = Math.round(Math.sin(t / 800) * width_2 / 2) + width_2 - 32
        var text_y = height - Math.round(Math.abs(Math.sin(t / 260)) * 50)
        d.text('RAINBOWS', text_x - 1, text_y - 16)
        d.text('RAINBOWS', text_x + 1, text_y - 16)
        d.text('RAINBOWS', text_x, text_y - 17)
        d.text('RAINBOWS', text_x, text_y - 15)
        d.text_color(color_str((color_current) % 360, 1, 0.5))
        d.text('RAINBOWS', text_x, text_y - 16)
    }

    self.exit = function () {

    }

    var color_current = 0;
    function color_increment(dt) {
        color_current = (color_current + dt / 10) % 360;
    }

    function color_str(h, s, l) {
        return 'hsl(' + Math.floor(h) + ',' + s * 100 + '%,' + l * 100 + '%)';
    }

    function color_set_fill(s, l) {
        d.ctx.fillStyle = color_str(color_current, s, l);
    }

    function color_set_fill_i(s, l) {
        d.ctx.fillStyle = color_str((color_current + 180) % 360, s, l);
    }

    function color_set_stroke(s, l) {
        d.ctx.strokeStyle = color_str(color_current, s, l);
    }

    function color_set_stroke_i(s, l) {
        d.ctx.strokeStyle = color_str((color_current + 180) % 360, s, l);
    }

    return self
}

var PRG_CHARMAP = function () {
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

    self.loop = function (dt) {
    }

    self.draw = function () {
        d.clear()
        var labels = '0123456789ABCDEF'
        d.text_color('#00F')
        for (var i = 0; i < labels.length; i++) {
            d.text(labels[i], 8, 20 + i * 12)
            d.text(labels[i], 20 + i * 12, 8)
        }
        d.text_color('#0F0')
        for (var j = 0; j < 16; j++)
        for (var i = 0; i < 255; i++) {
            d.text(String.fromCharCode(i),
                20 + (i % 16) * 12,
                20 + (i - (i % 16)) / 16 * 12)
        }
    }

    self.exit = function () {

    }

    return self
}

var PRG_KEYCHECK = function () {
    var d, s

    var self = this
    self.name = 'KEYCHECK'

    var keypresses = []
    self.keydown = function (evt) {
        if (evt.code == 'Escape') {
            s.next_program = new PRG_BOOT()
        }
        keypresses.push([evt.key, evt.code])
    }

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    self.loop = function (dt) {
    }

    self.draw = function () {
        d.clear()
        var max = keypresses.length > 10 ? keypresses.length - 10 : 0
        for (var i = keypresses.length - 1; i >= max; i--) {
            d.text('code: ' + keypresses[i][1] + ', key: ' + keypresses[i][0], 4, (keypresses.length - i - 1) * 10 + 4)
        }
    }

    self.exit = function () {

    }

    return self
}

var PRG_CONSOLE = function () {
    var d, s

    var self = this
    self.name = 'CONSOLE'

    var text = ''
    var result = ''
    self.keydown = function (evt) {
        if (evt.code == 'Enter') {
            try {
                function quit() {
                    s.next_program = new PRG_BOOT()
                }
                result = eval(text)
                if (result == undefined) result = 'no result'
            } catch (e) {
                result = 'invalid expression'
            }
        } else if (evt.code == 'Backspace') {
            text = text.substr(0, text.length - 1)
        } else if (evt.key.length == 1) {
            text += evt.key
        }
    }

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    var cursor_blink = 0
    self.loop = function (dt) {
        cursor_blink += dt * 4
    }

    self.draw = function () {
        d.clear()
        if (Math.floor(cursor_blink) % 2)
            d.text('> ' + text + '_', 4, 4)
        else
            d.text('> ' + text, 4, 4)
        d.text(result.toString(), 4, 14)
    }

    self.exit = function () {

    }

    return self
}
