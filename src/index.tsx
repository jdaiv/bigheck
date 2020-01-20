import { h, render } from 'preact'
import Desktop from './Desktop'
import './Main.module.css'
import './scripts/about'
import './scripts/contact'
import './scripts/intro'
import './scripts/projects'

console.log('hi!')
render(<Desktop />, document.querySelector('#app'))
