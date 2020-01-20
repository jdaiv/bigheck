import { Component, h } from 'preact'
import AppBase from './apps/AppBase'
import Desktop from './Desktop'

export interface IAppWindowProps {
    appId: number
    app: AppBase
    parent: Desktop
    index: number
}

export default class AppWindow extends Component<IAppWindowProps> {

    private x: number = 50
    private y: number = 50
    private dragging: boolean = false
    private lastX: number
    private lastY: number

    private move = (evt: MouseEvent) => {
        if (this.dragging) {
            const x = this.x += evt.clientX - this.lastX
            const y = this.y += evt.clientY - this.lastY
            this.lastX = evt.clientX
            this.lastY = evt.clientY
            this.setState({x, y})
        }
    }

    private mouseDown = (evt: MouseEvent) => {
        this.dragging = true
        this.lastX = evt.clientX
        this.lastY = evt.clientY
    }

    private mouseUp = () => {
        this.dragging = false
    }

    public close = () => {
        this.props.parent.closeApp(this.props.appId)
    }

    public render() {
        return <div class="window" style={`top: ${this.y}px; left: ${this.x}px; z-index: ${this.props.index}`}>
            <div class="title">
                <div
                    onMouseDown={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onMouseLeave={this.mouseUp}
                    onMouseMove={this.move}
                >
                    Title
                </div>
                <button>min</button>
                <button onClick={this.close}>close</button>
            </div>
        </div>
    }

}
