import Display from './Display'
import { SCRIPTS } from './scripts/scripts'

export default class Terminal {

    private raf: any
    private time: number
    private waitTime: number
    private activeScript: Iterator<number>

    public init() {
        this.play('intro')
        this.waitTime = 0
        this.raf = window.requestAnimationFrame(this.tick)
    }

    public tick = (ts: number) => {
        if (!this.time) {
            this.time = ts
        }
        const dt = ts - this.time

        if (this.activeScript != null) {
            this.waitTime -= dt
            if (this.waitTime <= 0) {
                try {
                    const result = this.activeScript.next()
                    Display.scrollBottom()
                    if (result.done) {
                        this.activeScript = null
                    } else {
                        this.waitTime = result.value
                    }
                } catch (e) {
                    console.error(e)
                    this.play('error')
                }
            }
        }

        this.time = ts
        this.raf = window.requestAnimationFrame(this.tick)
    }

    public play(scriptName: string) {
        this.activeScript = this.script(scriptName)
        this.waitTime = 0
    }

    private *script(scriptName: string): Iterator<number> {
        const script = SCRIPTS.get(scriptName)
        for (const line of script) {
            let slow = false
            let type = false
            switch (line[0]) {
                case 'wait':
                    yield line[1]
                    break
                case 'title':
                    Display.setTitle(line[1])
                    break
                case 'newline':
                    Display.addArt(' ')
                    break
                case 'type_append_slow':
                    slow = true
                case 'type_append':
                    type = true
                    break
                case 'type_slow':
                    slow = true
                    type = true
                    break
                case 'type':
                    Display.addMessage('')
                    type = true
                    break
                case 'link':
                    Display.addLink('', line[2])
                    type = true
                    break
                case 'actions':
                    Display.addActions(this, line[1])
                    break
                case 'script':
                    this.activeScript = this.script(line[1])
                    yield 0
                    break
            }
            if (type) {
                const typer = Display.appendMessageGenerator(line[1])
                if (typer == null) {
                    break
                }
                while (true) {
                    const result = typer.next()
                    if (result.done) {
                        break
                    }
                    yield this.getPause(slow)
                }
            }
        }
    }

    private getPause(slow: boolean): number {
        return slow ? 300 + Math.random() * 200 : 10 + Math.random() * 5
    }

}
