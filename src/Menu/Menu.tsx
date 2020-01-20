import { Component, h } from 'preact'
import styles from './Menu.module.css'

export interface IMenuProps {
    open: boolean
}

export default class Menu extends Component<IMenuProps> {

    public render({ open }, {}) {
        return <div class={`${styles.menu} ${open ? styles.visible : ''}`}>
            <button>Heck</button>
        </div>
    }

}
