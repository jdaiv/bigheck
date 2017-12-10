var PRG_SYS = function () {
    var d, s

    var self = this
    self.name = '???'

    self.keydown = function (evt) {
        s.ready = true
    }

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    var counter = 0
    var ram_check = 0
    self.loop = function (dt) {
        if (s.ready) {
            s.next_program = new PRG_BOOT()
            return
        }
        counter++
        if (counter > 90 && ram_check < 640) ram_check += 4
        if (counter > 360) {
            s.next_program = new PRG_BOOT()
            s.ready = true
        }
    }

    function pad_zero (num) {
        var str = Math.floor(num).toString()
        return ('0000' + str).substring(str.length);
    }

    self.draw = function () {
        d.clear()

        var x = 2
        var y = 24
        var min_counter = 0
        function t (text, time) {
            min_counter += time
            if (counter < min_counter) return
            d.text(text, x, y)
            y += 10
        }
        t('PNX BIOS', 30)
        t('R2', 30)
        t('', 15)
        var ram_text = 'RAM    ' +
            (ram_check >= 640 ? '   OK!' : pad_zero(ram_check) + ' KB')
        t(ram_text, 0)
        t('HDD0    ' + (ram_check >= 500 ? '  OK!' : 'CHECK'), 0)
        t('HDD1    ' + (ram_check >= 300 ? '  OK!' : 'CHECK'), 0)
        t('FDD0    ' + (ram_check >= 600 ? '  OK!' : 'CHECK'), 0)
        t('', 0)
        t('FDD0 EMPTY, BOOTING FROM HDD0...', 170)
    }

    self.exit = function () {

    }

    return self
}

var PRG_BOOT = function () {
    var d, s

    var self = this
    self.name = 'BOOT'

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    var selected = 0
    var fade_in = 0
    var loaded = true
    self.loop = function (dt) {

    }

    self.keydown = function (evt) {
        if (!loaded) return
        switch (evt.code) {
            case 'ArrowDown':
                selected++
                if (selected >= APPS.length) selected = 0
                break
            case 'ArrowUp':
                selected--
                if (selected < 0) selected = APPS.length - 1
                break
            case 'Enter':
                s.next_program = new APPS[selected][1]()
                break
        }
    }

    self.draw = function () {
        d.clear()
        d.ctx.fillStyle = '#0f0'

        var x = 4
        var y = 4
        d.text(' -- BOOT LOADER -- ', 4, 4)
        y += 24
        for (var i = 0; i < APPS.length; i++) {
            if (selected == i) {
                d.ctx.fillRect(0, y, d.width, 16)
                d.text_color('#000')
            } else {
                d.text_color('#0F0')
            }
            d.text(APPS[i][0] + ' >', x + 8, y + 4)
            y += 16
        }
        d.text_color('#0F0')
        y += 10
        d.text('\x18/\x19: change selection', x, y)
        y += 10
        d.text('ENTER: run option', x, y)
    }

    self.exit = function () {

    }

    return self
}

var PRG_OS = function () {
    var d, s

    var self = this
    self.name = 'PANIX'

    self.init = function (sys, display) {
        d = display
        s = sys
    }

    self.loop = function (dt) {
        s.set_error(self, 'unimplemented')
    }

    self.draw = function () {
        d.clear()
        d.reset_font()
    }

    self.exit = function () {

    }

    return self
}