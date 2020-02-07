import Terminal from './Terminal'

const titleSpan = document.getElementById('title')
const contentDiv = document.getElementById('content')

export default class Display {

    private static lastEl: Text = null
    private static lastActionEl: HTMLElement = null
    private static actionEls: Text[] = []

    public static setTitle(title: string) {
        titleSpan.textContent = title
    }

    public static addArt(content: string) {
        const el = new Text(contentDiv, 'pre')
        el.addText(content)
        Display.lastEl = el
    }

    public static addMessage(content: string) {
        const el = new Text(contentDiv, 'p')
        el.addText(content)
        Display.lastEl = el
    }

    public static appendMessage(content: string) {
        if (Display.lastEl !== null) {
            Display.lastEl.addText(content)
        }
    }

    public static appendMessageGenerator(content: string): Iterator<null> {
        if (Display.lastEl !== null) {
            return Display.lastEl.addTextYield(content)
        }
        return null
    }

    public static addLink(content: string, link: string) {
        const p = document.createElement('p')
        const el = new Text(p, 'a')
        el.el.setAttribute('href', link)
        el.addText(content)
        Display.lastEl = el
        contentDiv.appendChild(p)
    }

    public static addActions(terminal: Terminal, actions: any[]) {
        const el = document.createElement('div')
        el.className = 'actions'
        setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateX(0)'
        }, 0)
        this.actionEls = []
        actions.forEach(act => {
            const btn = new Text(el, 'button')
            btn.addText(act[0])
            btn.el.onclick = () => {
                this.actionEls.forEach(a => {
                    a.el.classList.add('disabled')
                    a.el.onclick = null
                })
                btn.el.classList.remove('disabled')
                btn.el.classList.add('selected')
                terminal.play(act[1])
            }
            this.actionEls.push(btn)
        })
        this.lastActionEl = el
        contentDiv.appendChild(el)
    }

    public static clear() {
        contentDiv.innerHTML = ''
        Display.lastEl = null
    }

    public static scrollBottom() {
        contentDiv.scrollTop = contentDiv.scrollHeight
    }

}

class Text {

    public el: HTMLElement
    private currentSpan: HTMLSpanElement
    private modStack: string[]

    constructor(parent: HTMLElement, type: string) {
        this.el = document.createElement(type)
        parent.appendChild(this.el)

        this.modStack = []
    }

    public addMod(mod: string) {
        switch (mod) {
            case '0':
                this.modStack.push('m-color0')
                break
            case '1':
                this.modStack.push('m-color1')
                break
            case '2':
                this.modStack.push('m-color2')
                break
            case '3':
                this.modStack.push('m-color3')
                break
            case '4':
                this.modStack.push('m-color4')
                break
            case '5':
                this.modStack.push('m-color5')
                break
            case '6':
                this.modStack.push('m-color6')
                break
            case '7':
                this.modStack.push('m-color7')
                break
            case 'b':
                this.modStack.push('m-bold')
                break
            case 'i':
                this.modStack.push('m-italics')
                break
            case 'e':
                this.modStack.push('m-emoji')
                break
            case 'n':
                this.modStack = []
                break
        }
        this.newSpan()
    }

    public popMod() {
        this.modStack.pop()
        this.newSpan()
    }

    public addText(text: string) {
        let span = this.getSpan()
        const split = [...text]
        let popNext = false
        for (let i = 0; i < split.length; i++) {
            const char = split[i]
            if (char === '^') {
                const mod = split[++i]
                this.addMod(mod)
                span = this.getSpan()
                if (mod === 'e') {
                    popNext = true
                }
            } else {
                span.textContent += char
                if (popNext) {
                    this.popMod()
                    popNext = false
                    span = this.getSpan()
                }
            }
        }
    }

    public *addTextYield(text: string): Iterator<null> {
        let span = this.getSpan()
        const split = [...text]
        let popNext = false
        for (let i = 0; i < split.length; i++) {
            const char = split[i]
            if (char === '^') {
                const mod = split[++i]
                this.addMod(mod)
                span = this.getSpan()
                if (mod === 'e') {
                    popNext = true
                }
            } else {
                span.textContent += char
                if (popNext) {
                    this.popMod()
                    popNext = false
                    span = this.getSpan()
                }
            }
            yield
        }
    }

    private getSpan() {
        if (this.currentSpan == null) {
            this.newSpan()
        }

        return this.currentSpan
    }

    private newSpan() {
        this.currentSpan = document.createElement('span')
        this.modStack.forEach(mod => this.currentSpan.classList.add(mod))
        this.el.appendChild(this.currentSpan)
    }

}
