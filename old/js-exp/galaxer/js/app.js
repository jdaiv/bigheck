
var APPS = [
    // ['test os', PRG_OS],
    ['rainbows \x02', PRG_RAINBOWS],
    ['charmap', PRG_CHARMAP],
    ['keycheck', PRG_KEYCHECK],
    ['console', PRG_CONSOLE],
    ['synth \x0E', PRG_SYNTH],
]

var sys
var startup_prg = new PRG_SYS()
function run () {
    sys = new PANIC_EXPRESS()
    sys.next_program = startup_prg
    sys.init()
}

window.onload = run