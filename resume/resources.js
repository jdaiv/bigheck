
const RESOURCES = {
    IMAGES: {
        theme01: 'ui_main.png'
    }
}

class Resources {

    constructor () {
        this.images = {}
    }

    load () {
        return new Promise((resolve, reject) => {
            let promises = []

            console.log('loading images...')
            for (let key in RESOURCES.IMAGES) {
                const url = RESOURCES.IMAGES[key]
                console.log(`loading ${key}: ${url}`)
                promises.push(this.loadImage(key, url))
            }

            Promise.all(promises).then(() => resolve())
        })
    }

    loadImage (name, url) {
        return new Promise((resolve, reject) => {
            let img = this.images[name] = new Image()
            // what if this image fails to load?
            img.onload = resolve
            img.src = url
        })
    }

}