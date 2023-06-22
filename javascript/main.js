const fs = require('fs')
let count = 1

Array.prototype.shuffle = function() { return this.sort(() => Math.random() * 2 - 1) }

const getFiles = ((dir) => {
    let r = fs.readdirSync(dir).map(e => dir + e).filter(e => !fs.lstatSync(e).isDirectory())
    let x = fs.readdirSync(dir).map(e => dir + e).filter(e => fs.lstatSync(e).isDirectory()).map(e => getFiles(e + '/'))
    for(let f of x) r = [...r, ...x]

    r = r.filter(e => !e.includes('global.d.ts'))
    return [...new Set(r.flat())]
})

const baller = (async (silent = false) => {
    let freud = fs.readFileSync('freud.js', 'utf-8')

    let texts = []
    let names = []
    let files = await getFiles('modules/')
    for (let cmd of files) {
        let txt = `${fs.readFileSync(cmd, 'utf-8')}`
        let f = cmd.split('.js')[0]
        f = f.split('/')[f.split('/').length - 1]
        if (!f.startsWith('_')) names.push(f)
        texts.push(txt)
        names = [...names, ...(txt.match(/\/\/--[\w\d$_\-.]+/g) ?? []).map(e => e.substring(4))]
    }

    let lists = '*?!^~&'.split('').shuffle()
    files = files.map(e => e.split('/').slice(1).join('/'))
    texts = texts.map((e, i) => `//${lists[i % lists.length]} BEGIN ${files[i]}\n${e}\n//${lists[i % lists.length]} END ${files[i]}`).join('\n\n')

    freud = freud.replaceAll('_modules()', texts).replaceAll(/\n *\n *\n/g, '\n')
    freud = freud.replaceAll('cases()', `parts = ${JSON.stringify(names)}\nfunctions = [${names.join(', ')}]`)

    fs.writeFileSync('dist.js', beautify(freud))
    require('./test.js')
})

baller()