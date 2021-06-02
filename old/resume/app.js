class App {

    static init () {
        App.paletteOffset = 0
        App.customStyles = document.createElement('style')
        document.body.appendChild(App.customStyles)
        if (GLRenderer.init()) {
            GLRenderer.clear()
            console.log('video init')
            const loadingStatusText = document.querySelector('#loading_status')
            ResourceManager.load(function (stats) {
                    loadingStatusText.innerHTML = `${stats.done} / ${stats.total}`
                })
                .then(() => {
                    GLRenderer.canvas.style.opacity = 1;
                    App.customStyles.innerHTML = `
                    h1, section {
                        background: rgba(0, 0, 0, 0);
                        box-shadow: none;
                        border: 0;
                    }
                    #photo > img {
                        opacity: 0;
                        cursor: pointer;
                    }`
                    document.querySelector('#overlay').classList.add('hide')
                    console.log('resources loaded')
                    ThemeManager.load()
                    MaterialManager.load()
                    setTimeout(App.run, 100)
                })
        }
        App.toolbox = document.querySelector('#toolbox')
    }

    static run () {
        const sections = document.querySelectorAll('section')
        App.sections = []
        for (let i = 0; i < sections.length; i++) {
             App.sections.push(new SectionBG(sections[i]))
        }
        App.flag = new Flag(document.querySelector('header'))
        const image = document.querySelector('#photo > img')
        image.onclick = function () {
            App.paletteOffset = 1
            App.rotatePalette = true
        }
        App.me = new ImageThres(image, 'me')
        window.requestAnimationFrame(App.draw)
        window.onresize = App.resize
    }

    static draw (t) {
        GLRenderer.t = t

        if (App.rotatePalette) {
            if (App.paletteOffset > 0) {
                App.paletteOffset += 0.5
                if (App.paletteOffset > 32) {
                    App.paletteOffset = 0
                }
            }
        }

        if (App.resizing) {
            App.flag.resize()
            App.sections.forEach(s => s.resize())
            App.me.resize()
        }
        GLRenderer.preRender()
        GLRenderer.clear()
        App.flag.draw()
        App.sections.forEach(s => s.draw())
        App.me.draw()
        GLRenderer.present()
        window.requestAnimationFrame(App.draw)
    }

    static resize () {
        GLRenderer.resize()
        App.flag.resize()
        App.sections.forEach(s => s.resize())
        App.me.resize()
    }

    static toggleToolbox () {
        App.toolbox.classList.toggle('open')
    }

    static printMe (evt) {
        window.print()
    }

    static downloadPDF (evt) {
        window.open('resume-of-john-aivaliotis.pdf')
        // App.toggleToolbox()
    }

    static openThemeSelect (evt) {
        ThemeManager.toggleSelector()
        // App.toggleToolbox()
    }

}