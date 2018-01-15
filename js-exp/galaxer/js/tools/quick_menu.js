function TOOL_QUICK_MENU () {

    var self = this

    self.data = {}
    var options = []
    var selected_option = 0

    self.open = false

    self.keydown = function (evt) {
        if (options.length < 1) return false

        if (evt.code == 'Enter') {
            self.open = !self.open
            return true
        }

        if (!self.open) return

        var option = options[selected_option]
        switch (evt.code) {
            case 'ArrowDown':
                if (selected_option < options.length - 1)
                    selected_option++
                return true
            case 'ArrowUp':
                if (selected_option > 0) selected_option--
                return true
            case 'ArrowLeft':
                dec_option(option)
                return true
            case 'ArrowRight':
                inc_option(option)
                return true
            case 'Escape':
                self.open = false
                return true
        }

        return false
    }

    function pad_space (str, start) {
        return ('                   ' + str).substring(start + str.length);
    }

    self.draw = function (d) {
        if (self.open) {
            d.ctx.globalAlpha = 0.8
            d.ctx.fillStyle = '#000'
            d.ctx.fillRect(8, 8, 184, options.length * 8 + 32)
            d.ctx.globalAlpha = 1
            var y = 8
            d.text('\xDA\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xBF', 8, y)
            y += 8
            d.text('\xB3 OPTIONS             \xB3', 8, y)
            y += 8
            d.text('\xC3\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xB4', 8, y)
            y += 8
            options.forEach(function (opt, idx) {
                var value = self.data[opt.name].toString()
                d.text(
                    '\xB3 ' + opt.name + ': ' + pad_space(selected_option == idx ?
                        '\x1B' + value + '\x1A' : value + ' ', opt.name.length + 2) + ' \xB3',
                    8, y)
                y += 8
            })
            d.text('\xC0\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xC4\xD9', 8, y)
        }
    }

    self.add_bool = function (name, start) {
        options.push({
            name: name,
            type: 'bool',
            default: start
        })
        self.data[name] = start
    }

    self.add_num = function (name, start, min, max, inc) {
        options.push({
            name: name,
            type: 'num',
            min: min,
            max: max,
            inc: inc,
            default: start
        })
        self.data[name] = start
    }

    self.add_select = function (name, values, start) {
        options.push({
            name: name,
            type: 'select',
            values: values,
            default: start
        })
        self.data[name] = values[start]
        self.data[name + '_idx'] = start
    }

    function inc_option (option) {
        var value = self.data[option.name]
        switch (option.type) {
            case 'bool':
                self.data[option.name] = !value
                break
            case 'select':
                value = self.data[option.name + '_idx']

                if (value < option.values.length - 1) value++
                else value = 0
                self.data[option.name] = option.values[value]

                self.data[option.name + '_idx'] = value
                break
            case 'num':
                if (value < option.max)
                    self.data[option.name] = Math.floor(
                        (self.data[option.name] + option.inc) * 100) / 100
                break
        }
    }

    function dec_option (option) {
        var value = self.data[option.name]
        switch (option.type) {
            case 'bool':
                self.data[option.name] = !value
                break
            case 'select':
                value = self.data[option.name + '_idx']

                if (value > 0) value--
                else value = option.values.length - 1
                self.data[option.name] = option.values[value]

                self.data[option.name + '_idx'] = value
                break
            case 'num':
                if (value > option.min)
                    self.data[option.name] = Math.floor(
                        (self.data[option.name] - option.inc) * 100) / 100
                break
        }
    }

    return self

}