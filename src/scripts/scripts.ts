const error =  [
    ['title', 'unexpected error'],
    ['wait', 500],
    ['newline'],
    ['type', `Oh no, an error occured!`],
    ['newline'],
    ['type', `😖 Well, this is awkward. I don't have this part scripted.
 You might get something from the console though!`],
    ['wait', 500],
    ['newline'],
    ['type', `Y'all are welcome to try again though.`],
    ['actions', [
        ['↩ back to the start', 'backToStart']
    ]]
]

const scripts = new Map<string, any[]>()
scripts.set('error', error)

export const SCRIPTS = scripts
