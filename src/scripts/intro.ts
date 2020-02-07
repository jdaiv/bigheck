import { SCRIPTS } from './scripts'

SCRIPTS.set('backToStart', [
    ['type', 'Ok! What else would you like to see?'],
    ['script', 'introActions']
])

SCRIPTS.set('backToStartNope', [
    ['type', 'Alrighty, anything else you would like to know?'],
    ['script', 'introActions']
])

SCRIPTS.set('introActions', [
    ['actions', [
        ['^e👨‍💻 about me', 'about'],
        ['^e🧩 my projects', 'projects'],
        ['^e💌 how to contact me', 'contact']]
    ]
])

SCRIPTS.set('intro', [
    ['title', 'introduction'],
    ['type', '^e👋 ^bHi there stranger!'],
    ['newline'],
    ['wait', 500],
    ['type', `Name's John, and this is my homepage!`],
    ['wait', 500],
    ['newline'],
    ['type', `It's a little sparce right now while I'm still working on it`],
    ['type_append_slow', '...'],
    ['wait', 250],
    ['newline'],
    ['type', 'So uh, what would you like to know? ^e🤔'],
    ['script', 'introActions']
])
