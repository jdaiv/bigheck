
var APPS = [
    // ['test os', PRG_OS],
    ['rainbows \x02', PRG_RAINBOWS],
    ['charmap', PRG_CHARMAP],
    ['keycheck', PRG_KEYCHECK],
    ['console', PRG_CONSOLE],
    ['synth \x0E', PRG_SYNTH],
]

function run () {
    var sys = new PANIC_EXPRESS()
    sys.next_program = new PRG_SYS()
    sys.init()
}

window.onload = run