import { SCRIPTS } from './scripts'

SCRIPTS.set('projects', [
    ['title', 'projects'],
    ['wait', 500],
    ['type', 'My projects!? ^bGreat!'],
    ['wait', 500],
    ['newline'],
    ['type', `Still filling this section in. But there's still things to show!`],
    ['wait', 500],
    ['newline'],
    ['type', `What sorta project would you like to hear about?`],
    ['script', 'projectsActions']
])

SCRIPTS.set('projectsActions', [
    ['actions', [
        ['^e📍 this site', 'thisSite'],
        ['^e⚔ multiplayer experiments', 'multiplayerExp'],
        ['^e🗑 other personal stuff', 'personalStuff'],
        // ['💸 paid projects', 'thisSite'],
        ['^e↩ back to the start', 'backToStart']
    ]]
])

SCRIPTS.set('projectsBack', [
    ['title', 'projects'],
    ['type', `What other project do you want to know about?`],
    ['script', 'projectsActions']
])

SCRIPTS.set('thisSite', [
    ['title', 'projects > this site'],
    ['wait', 500],
    ['type', `Hey, neat!`],
    ['newline'],
    ['type', `This site was a real struggle to design... `],
    ['wait', 500],
    ['type_append', `From the start I knew I wanted a, uh, ^iexploration focussed^n style? ^e🤔`],
    ['wait', 2000],
    ['newline'],
    ['type', `I started with a faux terminal, complete with a mock file system and command parser. `],
    ['wait', 500],
    ['type_append', `But I knew I needed the site to be mobile friendly, and the UI challenges were too great for a ^bfun^n project. ^e😔`],
    ['wait', 1000],
    ['newline'],
    ['type', `So I stripped it all back and started again with a focus on something more touch friendly.`],
    ['wait', 2000],
    ['newline'],
    ['type', `Eventually I arrived at branching dialog choices. ^e💬`],
    ['wait', 500],
    ['newline'],
    ['type', `It provided the same "exploration" feel as the faux terminal, `],
    ['type_append', `without the potential accessibilty issues for mobile or less experienced users. ^e✨`],
    ['wait', 2000],
    ['newline'],
    ['type', `Technology-wise the site is pretty basic. No frameworks or complex code.`],
    ['wait', 1000],
    ['newline'],
    ['type', `All written in TypeScript, packaged with Parcel, and sent off to Netlify to be served to you!`],
    ['wait', 500],
    ['newline'],
    ['type', `Not much more to say about it really. The scripts you're reading are pretty basic, bare minimum really.`],
    ['wait', 500],
    ['type_append', ` I've left sourcemaps enabled if you want to poke around and laugh at my code. ^e😅`],
    ['wait', 1000],
    ['newline'],
    ['type', `Are there any other projects you'd like to see?`],
    ['actions', [
        ['^e✔ yep', 'projectsBack'],
        ['^e❌ nope', 'backToStartNope']
    ]]
])

SCRIPTS.set('multiplayerExp', [
    ['title', 'projects > multiplayer'],
    ['wait', 500],
    ['type', `Oh this one!`],
    ['wait', 500],
    ['type_append', ` Not quite done yet though. ^e😕`],
    ['wait', 500],
    ['newline'],
    ['type', `But once I pick up and shake all the dust off, it'll be a small multiplayer lobby to hangout in and mess with a bunch of gadgets together.`],
    ['wait', 1000],
    ['newline'],
    ['type', `Think there's any other projects you'd like to know about?`],
    ['actions', [
        ['^e✔ sure', 'projectsBack'],
        ['^e❌ no', 'backToStartNope']
    ]]
])

SCRIPTS.set('personalStuff', [
    ['title', 'projects > personal stuff'],
    ['wait', 500],
    ['type', `Uh, yeah...`],
    ['wait', 500],
    ['type_append', ` I have some other stuff to package up and get ^ipresentable^n.`],
    ['wait', 500],
    ['newline'],
    ['type', `I'll put it all up on teh GitHubz when done!`],
    ['wait', 1000],
    ['newline'],
    ['type', `Maybe.`],
    ['wait', 1000],
    ['type_append', ` You know how it is.`],
    ['wait', 2000],
    ['newline'],
    ['type', `Maybe there's another project you'd like to look at?`],
    ['actions', [
        ['^e✔ yeah', 'projectsBack'],
        ['^e❌ nah', 'backToStartNope']
    ]]
])
