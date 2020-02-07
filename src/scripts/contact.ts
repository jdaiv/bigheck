import { SCRIPTS } from './scripts'

SCRIPTS.set('contact', [
    ['title', 'contact me'],
    ['wait', 500],
    ['type', 'Contacting me, alright.'],
    ['wait', 1000],
    ['newline'],
    ['type', 'You can find me across various channels:'],
    ['link', 'Twitter', 'https://twitter.com/bigHck'],
    ['link', 'GitHub', 'https://github.com/jdaiv'],
    ['link', 'LinkedIn', 'https://www.linkedin.com/in/jdaiv/'],
    ['wait', 1000],
    ['newline'],
    ['type', `Anything else you'd like to know?`],
    ['script', 'introActions']
])
