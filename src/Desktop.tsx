import { Component, h } from 'preact'
import AppBase from './apps/AppBase'
import AppWindow from './AppWindow'
import styles from './Main.module.css'
import Menu from './Menu/Menu'
import Taskbar from './taskbar/Taskbar'

interface IAppData {
    app: AppBase
    index: number
}

let appCounter = 0

export default class Desktop extends Component<{}> {

    public state = {
        menuOpen: false,
        dialogBoxes: [] as string[]
    }

    private openApps: Map<number, IAppData> = new Map()

    public openApp(app: AppBase) {
        this.openApps.set(appCounter++, {
            app, index: this.openApps.size
        })
        this.forceUpdate()
        console.log(this.openApps)
    }

    public closeApp(key: number) {
        this.openApps.delete(key)
        this.forceUpdate()
        console.log(key, this.openApps)
    }

    public toggleMenu() {
        this.setState({ menuOpen: !this.state.menuOpen })
    }

    public dialogBox(message: string) {
        this.state.dialogBoxes.push(message)
        this.forceUpdate()
    }

    private popDialogBox = () => {
        this.state.dialogBoxes.pop()
        this.forceUpdate()
    }

    public render({}, { menuOpen }) {
        const apps = []
        this.openApps.forEach((a, key) => {
            apps.push(<AppWindow key={key} appId={key} app={a.app} parent={this} index={a.index} />)
        })
        const dialogBoxes = this.state.dialogBoxes.map(msg =>
            <div class={styles['dialog-box']}><p>{msg}</p><button onClick={this.popDialogBox}>Ok</button></div>)
        return <div class={styles.container}>
            <Taskbar parent={this} />
            {dialogBoxes}
            <div class={styles.content}>
                <Menu open={menuOpen} />
                {apps}
            </div>
            <footer></footer>
        </div>
    }

}
