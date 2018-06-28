
const FILL = -1
const NO_FILL = -2
const REPEAT = -3
const THEMES = [
    {
        name: 'Desert',
        subtitle: 'Classic',
        image: 'theme01',
        background: 'url(\'background.png\')',
        sectionPadding: '4rem 2rem',
        colors: {
            text: 'black'
        },
        width: 64,
        height: 64,
        imagePalette: [1, 2, 3, 4, 5],
        flag: [
            [0x9e / 0xFF, 0x28 / 0xFF, 0x35 / 0xFF, 1],
            [0x3f / 0xFF, 0x28 / 0xFF, 0x32 / 0xFF, 1],
            [0xe4 / 0xFF, 0x3b / 0xFF, 0x44 / 0xFF, 1]
        ],
        slices: [
            [30,   0, 30, FILL, 34, 64],
            [FILL, 0, 8,  FILL, 56, 64],
            [30,   0, 8,  FILL, 10, 54, FILL, 56,  64]
        ]
    },
    {
        name: 'Crunchy',
        subtitle: 'Ow, my eyes',
        image: 'theme02',
        background: 'url(\'bg2.png\')',
        sectionPadding: '3rem',
        colors: {
            text: '#e2e8f5'
        },
        width: 64,
        height: 64,
        repeatFlip: false,
        imagePalette: [16, 17, 18, 19, 20],
        flag: [
            [0x00 / 0xff, 0x95 / 0xff, 0xe9 / 0xff, 1],
            [0x12 / 0xFF, 0x4e / 0xFF, 0x89 / 0xFF, 1],
            [0x00 / 0xff, 0x75 / 0xff, 0xc9 / 0xff, 1]
        ],
        slices: [
            [28,     0, 28, REPEAT, 36, 64],
            [REPEAT, 0, 28, FILL,   36, 64],
            [28,     0, 28, REPEAT, 36, 64]
        ]
    },
]

// should be moved
function generateVerts (verts, triangles) {
    let arr = []
    triangles.forEach(t => arr.push(verts[t][0], verts[t][1]))
    return arr
}

class ThemeManager {

    static load () {
        console.log('preparing themes')

        ThemeManager.selector = document.querySelector('#theme_selector')
        ThemeManager.selectorInner = document.querySelector('#theme_selector .inner')

        THEMES.forEach(t => {
            console.log('reading theme:', t.name)

            // ThemeManager.calculateThemeTriangles(t)
            // ThemeManager.calculateThemeUVs(t)

            let themeBtn = document.createElement('button')
            let container = document.createElement('div')
            themeBtn.innerHTML = t.name
            themeBtn.style.background =
                `url('${ResourceManager.imagesSrc[t.image].src}'), ${t.background}`
            themeBtn.style.color = t.colors.text
            themeBtn.style.height = t.height + 40 + 'px'
            themeBtn.appendChild(container)
            themeBtn.onclick = () => {
                ThemeManager.toggleSelector()
                ThemeManager.change(t)
            }
            ThemeManager.selectorInner.appendChild(themeBtn)


        })

        ThemeManager.css = document.createElement('style')
        document.body.appendChild(ThemeManager.css)

        ThemeManager.change(THEMES[0], true)
    }

    static change (t, skipResize) {
        if (t == ThemeManager.current) return
        console.log('changing theme to:', t)
        ThemeManager.current = t
        ThemeManager.generateCSS(t)
        if (!skipResize) {
            App.resizing = true
            setTimeout(() => {
                App.resizing = false
            }, 500)
        }
    }

    static generateCSS (t) {
        ThemeManager.css.innerHTML = `
            html {
                background: ${t.background};
            }
            body {
                color: ${t.colors.text};
            }
            .columns > .column > section {
                padding: ${t.sectionPadding};
            }
        `
    }

    static toggleSelector () {
        ThemeManager.selectorInner.scrollY = 0
        ThemeManager.selector.classList.toggle('open')
    }

}

