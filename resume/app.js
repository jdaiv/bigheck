class App {

    static run () {
        const sections = document.querySelectorAll('section')
        App.sections = []
        for (let i = 0; i < sections.length; i++) {
             App.sections.push(new SectionBG(sections[i]))
        }
        App.flag = new Flag(document.querySelector('header'))
        App.dirty = true
        window.requestAnimationFrame(App.draw)
        window.onresize = () => {
            vga.resize()
            App.flag.resize()
            App.sections.forEach(s => s.resize())
            App.dirty = true
        }
        window.onscroll = () => {
            App.dirty = true
        }
    }

    static draw (t) {
        GLRenderer.t = t
        if (App.dirty) {
            GLRenderer.clear()
            App.flag.draw()
            App.sections.forEach(s => s.draw())
        }
        window.requestAnimationFrame(App.draw)
        // App.dirty = false
    }

}