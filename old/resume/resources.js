
const RESOURCES = {
    IMAGES: {
        theme01: 'ui_main.png',
        theme01bg: 'background.png',
        theme02: 'bad_theme.png',
        theme02bg: 'bg2.png',
        // pre-cache somethings
        toolBg: 'tools_bg1.png',
        toolBgHover: 'tools_bg2.png',
        me: 'me_.jpg',
        palette: 'palette.png'
    },
    SHADERS: {
        default_post_vs: 'shaders/default_post_vs.glsl',
        default_post_fs: 'shaders/default_post_fs.glsl',
        default_vs: 'shaders/default_vs.glsl',
        default_fs: 'shaders/default_fs.glsl',
        flag_vs: 'shaders/flag_vs.glsl',
        flag_fs: 'shaders/flag_fs.glsl',
        image_fs: 'shaders/image_fs.glsl'
    }
}

class ResourceManager {

    static load (updateCallback) {
        ResourceManager.images = {}
        ResourceManager.imagesSrc = {}
        ResourceManager.shaders = {}
        return new Promise((resolve, reject) => {
            let promises = []

            let stats = {
                total: 0,
                done: 0
            }

            function updateStats () {
                stats.done++
                if (updateCallback) updateCallback(stats)
            }

            console.log('loading images...')
            for (let key in RESOURCES.IMAGES) {
                const url = RESOURCES.IMAGES[key]
                console.log(`loading image ${key}: ${url}`)
                stats.total++
                promises.push(ResourceManager.loadImage(key, url)
                    .then(updateStats))
            }

            for (let key in RESOURCES.SHADERS) {
                const url = RESOURCES.SHADERS[key]
                console.log(`loading shader ${key}: ${url}`)
                stats.total++
                promises.push(ResourceManager.loadText('shaders', key, url)
                    .then(updateStats))
            }

            updateCallback(stats)

            Promise.all(promises).then(() => resolve())
        })
    }

    static loadImage (name, url) {
        return new Promise((resolve, reject) => {
            let img = ResourceManager.imagesSrc[name] = new Image()
            // what if this image fails to load?
            img.onload = () => {
                ResourceManager.images[name] = new GLTexture(img)
                resolve()
            }
            img.src = url
        })
    }

    static loadText (key, name, url) {
        return fetch(url)
                .then(r => r.text())
                .then(txt => ResourceManager[key][name] = txt)
                .catch(e => console.error(r))
    }

}