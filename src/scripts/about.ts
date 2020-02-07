import { SCRIPTS } from './scripts'

SCRIPTS.set('about', [
    ['title', 'about me'],
    ['wait', 500],
    ['type', 'Oh, you want to know more about me?'],
    ['wait', 500],
    ['newline'],
    ['type', `Well, I'm just a self-taught programmer trying to find his place in the vast world of software.`],
    ['wait', 500],
    ['newline'],
    ['type', `Any specifics you'd like to know?`],
    ['actions', [
        ['^e⏳ my history', 'history'],
        ['^e↩ back to the start', 'backToStart']
    ]]
])

SCRIPTS.set('history', [
    ['title', 'my history'],
    ['wait', 500],
    ['type', '^iMy history?'],
    ['newline'],
    ['wait', 500],
    ['type', `There ain't much to me.`],
    ['wait', 500],
    ['newline'],
    ['type', `I taught myself programming in high school.`],
    ['wait', 500],
    ['type_append', ` Went to university for a year, dropped out.`],
    ['wait', 500],
    ['type_append', ` Did some other irrevelevent courses, retail work, etc.`],
    ['wait', 1000],
    ['newline'],
    ['type', `Pretty much the usual for someone unsure about his future.`],
    ['wait', 1500],
    ['newline'],
    ['type', `Then one my teachers told me to just go out and get a software job, so I did!`],
    ['wait', 500],
    ['type_append', ` Turns out I was much better than I thought!`],
    ['wait', 500],
    ['newline'],
    ['type', `But now my next challenge is finding out what I want to dig deep and specialise in`],
    ['type_append_slow', '...'],
    ['wait', 1000],
    ['newline'],
    ['type', `Anything else you'd like to know about me?`],
    ['actions', [
        ['↩ back to the start', 'backToStart']
    ]]
])
