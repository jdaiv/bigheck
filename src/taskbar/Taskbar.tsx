import { Component, h } from 'preact'
import Desktop from '../Desktop'
import styles from './Taskbar.module.css'

export interface ITaskbarProps {
    parent: Desktop
}

export default class TaskBar extends Component<ITaskbarProps> {

    private toggleMenu = () => {
        this.props.parent.toggleMenu()
    }

    private showHelp = () => {
        this.props.parent.dialogBox('Help!')
    }

    public render() {
        return <header class={styles.taskbar}>
            <div class={styles.menu}>
                <button onClick={this.toggleMenu}>Menu</button>
            </div>
            <div class={styles.apps}>

            </div>
            <div class={styles.status}>
                <button>🔊</button>
                <button onClick={this.showHelp}>❔</button>
            </div>
        </header>
    }

}
