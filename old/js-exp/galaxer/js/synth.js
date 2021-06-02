var PRG_SYNTH = function () {
    var d, s

    var self = this
    self.name = 'SYNTH'

    var types = [
        'sine',
        'sawtooth',
        'triangle',
        'square',
        'none',
    ]

    var menu = new TOOL_QUICK_MENU()
    menu.add_bool('arp', false)
    menu.add_num('arp_speed', 50, 0, 100, 5)
    menu.add_select('type', types, 0)
    menu.add_select('type_2', types, 0)
    menu.add_num('attack', 0.05, 0, 1, 0.05)
    menu.add_num('gain', 0.1, 0, 1, 0.05)
    menu.add_num('release', 0.3, 0, 1, 0.05)

    var notes_playing = []
    var visuals = []
    var octave = 4
    var type = 3
    function play (key, note, octaves, type2) {
        if (octaves == null) octaves = 0
        if (notes_playing[key]) return null

        if (type2) {
            if (menu.data.type_2 == 'none') {
                return
            }
        } else {
            play(key + '_2', note, 0, true)
            if (menu.data.type == 'none') {
                return
            }
        }

        var channel
        if (channel = get_free_channel()) {
            channel.gain.gain.linearRampToValueAtTime(menu.data.gain,
                ctx.currentTime + menu.data.attack)
            channel.gain.gain.setValueAtTime(menu.data.gain,
                ctx.currentTime + menu.data.attack)
            note += 12 * (octave + octaves)
            var freq = notes[note]
            channel.osc.type = type2 ? menu.data.type_2 : menu.data.type
            channel.osc.frequency.setValueAtTime(freq, 0)
            channel.note = note
            notes_playing[key] = {
                channel: channel,
                note: note,
                arp: 0,
            }
            add_visual(note)
            return channel
        }
    }

    function add_visual (note) {
        visuals.push({
            y: note / notes.length * d.height,
            x: d.width,
            char: (Math.random() > 0.5 ? '\x0D' : '\x0E'),
        })
    }

    var space_down = false

    self.keydown = function (evt) {
        if (menu.keydown(evt)) {
            return
        }
        switch (evt.code) {
            case 'KeyQ':
                play(evt.code, -5)
                break
            case 'Digit2':
                play(evt.code, -4)
                break
            case 'KeyW':
                play(evt.code, -3)
                break
            case 'Digit3':
                play(evt.code, -2)
                break
            case 'KeyE':
                play(evt.code, -1)
                break
            case 'KeyR':
                play(evt.code, 0)
                break
            case 'Digit5':
                play(evt.code, 1)
                break
            case 'KeyT':
                play(evt.code, 2)
                break
            case 'Digit6':
                play(evt.code, 3)
                break
            case 'KeyY':
                play(evt.code, 4)
                break
            case 'KeyU':
                play(evt.code, 5)
                break
            case 'Digit8':
                play(evt.code, 6)
                break
            case 'KeyI':
                play(evt.code, 7)
                break
            case 'Digit9':
                play(evt.code, 8)
                break
            case 'KeyO':
                play(evt.code, 9)
                break
            case 'Digit0':
                play(evt.code, 10)
                break
            case 'KeyP':
                play(evt.code, 11)
                break
            case 'BracketLeft':
                play(evt.code, 12)
                break
            case 'Equal':
                play(evt.code, 13)
                break
            case 'BracketRight':
                play(evt.code, 14)
                break
            case 'PageUp':
                if (octave < 7) octave++
                break
            case 'PageDown':
                if (octave > 0) octave--
                break
            case 'Escape':
                s.next_program = new PRG_BOOT()
            case 'Space':
                space_down = true
                break
        }
    }

    self.keyup = function (evt) {
        if (notes_playing[evt.code]) {
            release_channel(notes_playing[evt.code].channel)
            notes_playing[evt.code] = null
        }
        if (notes_playing[evt.code + '_2']) {
            release_channel(notes_playing[evt.code + '_2'].channel)
            notes_playing[evt.code + '_2'] = null
        }
        if (evt.code == 'Space') {
            space_down = false
        }
    }

    var ctx
    var analyser
    var a_buffer

    var channels = []
    function create_channel (ctx) {
        var gain = ctx.createGain()
        gain.connect(ctx.destination)
        gain.gain.value = 0
        var osc = ctx.createOscillator()
        osc.connect(gain)
        osc.start(0)
        channels.push({
            free: true,
            gain: gain,
            osc: osc,
            note: 0
        })
    }

    function get_free_channel () {
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].free && channels[i].gain.gain.value <= 0) {
                channels[i].free = false
                return channels[i]
            }
        }
        return null
    }

    function release_channel (chan) {
        chan.free = true
        chan.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + menu.data.release)
        // chan.gain.gain.setValueAtTime(0.0, ctx.currentTime + menu.data.release)
    }

    self.init = function (sys, display) {
        d = display
        s = sys
        ctx = new AudioContext()
        analyser = ctx.createAnalyser()
        a_buffer = new Uint8Array(analyser.bufferLength)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        create_channel(ctx)
        backing_channel = get_free_channel()
        // backing_channel.gain.gain.setValueAtTime(0.3, 0)
    }

    var arp_steps = [0, 4, 7, 4]
    // var arp_steps = [0, 4, 7, 12, 16, 19, 24, 28, 31]
    var arp_dist = 3
    var arp_count = 0
    var last_arp = 0

    var backing_bass = [
        12, 24, 12, 24, 12, 24, 12, 24,
        12, 26, 12, 26, 12, 26, 12, 26,
        12, 28, 12, 28, 12, 28, 12, 28,
        12, 26, 12, 26, 12, 26, 12, 26,
    ]
    var backing_timer = 0
    var backing_count = 0
    var backing_channel

    var _dt = 0
    self.loop = function (dt) {
        var speed = 40 //visuals.length * 4

        x_scroll -= dt * speed
        if (x_scroll < 0) x_scroll = 20

        var remove_first = 0
        visuals.forEach(function (note) {
            if (note.x < -8) {
                remove_first++
                return
            }
            note.x -= dt * speed
        })
        visuals = visuals.slice(remove_first, visuals.length)

        if (menu.data.arp || space_down) {
            arp_count += dt * menu.data.arp_speed
            if (arp_count >= arp_steps.length) arp_count = 0
            var step = Math.floor(arp_count)
            channels.forEach(function (chan) {
                if (chan != backing_channel && chan.gain.gain.value > 0) {
                    var note = chan.note + arp_steps[step]
                    chan.osc.frequency.setValueAtTime(notes[note], 0)
                    if (last_arp != step) add_visual(note)
                }
            })
            last_arp = step
        } else {
            arp_count = 0
            channels.forEach(function (chan) {
                if (chan != backing_channel && chan.gain.gain.value > 0) {
                    chan.osc.frequency.setValueAtTime(notes[chan.note], 0)
                }
            })
        }

        // backing_timer += dt
        // if (backing_timer >= 0.2) {
        //     backing_timer -= 0.2
        //     add_visual(backing_bass[backing_count])
        //     backing_channel.osc.frequency.linearRampToValueAtTime(
        //         notes[backing_bass[backing_count]], ctx.currentTime + 0.1)
        //     backing_count++
        //     if (backing_count > backing_bass.length - 1) {
        //         backing_count = 0
        //     }
        // }

        analyser.getByteTimeDomainData(a_buffer)
        _dt = dt
    }

    var x_scroll = 0

    self.draw = function () {
        // d.clear()

        d.ctx.globalAlpha = 0.2
        d.ctx.fillStyle = '#000'
        d.ctx.fillRect(0, 0, d.width, d.height)
        d.ctx.globalAlpha = 1

        visuals.forEach(function (note) {
            if (note.x < -8) return
            d.text(note.char, Math.floor(note.x), Math.floor(note.y + Math.sin(note.x / 20) * 5)) + 10
        })

        d.ctx.fillStyle = '#0F0'
        for (var y = 0; y < d.height; y += 10) {
            for (var x = 0; x < d.width / 20; x++) {
                var _x = x * 20 + x_scroll
                d.ctx.fillRect(
                    Math.floor(_x),
                    Math.floor(y + Math.sin(_x / 20) * 5), 1, 1)
            }
        }

        menu.draw(d)

        d.ctx.fillStyle = '#000'
        d.ctx.fillRect(0, d.height - 16, d.width, 16)
        d.text('octave: ' + octave, 4, d.height - 12)
        d.text('fps: ' + Math.round(1 / _dt), 92, d.height - 12)
    }

    self.exit = function () {
        ctx.close()
    }

    var notes = [
        16.35,   // C0          0
        17.32,   // C#0/Db0     1
        18.35,   // D0          2
        19.45,   // D#0/Eb0     3
        20.60,   // E0          4
        21.83,   // F0          5
        23.12,   // F#0/Gb0     6
        24.50,   // G0          7
        25.96,   // G#0/Ab0     8
        27.50,   // A0          9
        29.14,   // A#0/Bb0     10
        30.87,   // B0          11
        32.70,   // C1          12
        34.65,   // C#1/Db1     13
        36.71,   // D1          14
        38.89,   // D#1/Eb1     15
        41.20,   // E1          16
        43.65,   // F1          17
        46.25,   // F#1/Gb1     18
        49.00,   // G1          19
        51.91,   // G#1/Ab1     20
        55.00,   // A1          21
        58.27,   // A#1/Bb1     22
        61.74,   // B1          23
        65.41,   // C2          24
        69.30,   // C#2/Db2     25
        73.42,   // D2          26
        77.78,   // D#2/Eb2     27
        82.41,   // E2          28
        87.31,   // F2          29
        92.50,   // F#2/Gb2     30
        98.00,   // G2          31
        103.83,  // G#2/Ab2     32
        110.00,  // A2          33
        116.54,  // A#2/Bb2     34
        123.47,  // B2          35
        130.81,  // C3          36
        138.59,  // C#3/Db3     37
        146.83,  // D3          38
        155.56,  // D#3/Eb3     39
        164.81,  // E3          40
        174.61,  // F3          41
        185.00,  // F#3/Gb3     42
        196.00,  // G3          43
        207.65,  // G#3/Ab3     44
        220.00,  // A3          45
        233.08,  // A#3/Bb3     46
        246.94,  // B3          47
        261.63,  // C4          48
        277.18,  // C#4/Db4     49
        293.66,  // D4          50
        311.13,  // D#4/Eb4     51
        329.63,  // E4          52
        349.23,  // F4          53
        369.99,  // F#4/Gb4     54
        392.00,  // G4          55
        415.30,  // G#4/Ab4     56
        440.00,  // A4          57
        466.16,  // A#4/Bb4     58
        493.88,  // B4          59
        523.25,  // C5          60
        554.37,  // C#5/Db5     61
        587.33,  // D5          62
        622.25,  // D#5/Eb5     63
        659.25,  // E5          64
        698.46,  // F5          65
        739.99,  // F#5/Gb5     66
        783.99,  // G5          67
        830.61,  // G#5/Ab5     68
        880.00,  // A5          69
        932.33,  // A#5/Bb5     70
        987.77,  // B5          71
        1046.50, // C6          72
        1108.73, // C#6/Db6     73
        1174.66, // D6          74
        1244.51, // D#6/Eb6     75
        1318.51, // E6          76
        1396.91, // F6          77
        1479.98, // F#6/Gb6     78
        1567.98, // G6          79
        1661.22, // G#6/Ab6     80
        1760.00, // A6          81
        1864.66, // A#6/Bb6     82
        1975.53, // B6          83
        2093.00, // C7          84
        2217.46, // C#7/Db7     85
        2349.32, // D7          86
        2489.02, // D#7/Eb7     87
        2637.02, // E7          88
        2793.83, // F7          89
        2959.96, // F#7/Gb7     90
        3135.96, // G7          91
        3322.44, // G#7/Ab7     92
        3520.00, // A7          93
        3729.31, // A#7/Bb7     94
        3951.07, // B7          95
        4186.01, // C8          96
        4434.92, // C#8/Db8     97
        4698.63, // D8          98
        4978.03, // D#8/Eb8     99
        5274.04, // E8          100
        5587.65, // F8          101
        5919.91, // F#8/Gb8     102
        6271.93, // G8          103
        6644.88, // G#8/Ab8     104
        7040.00, // A8          105
        7458.62, // A#8/Bb8     106
        7902.13, // B8          107
    ]

    return self
}