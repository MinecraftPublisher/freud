//--$import
const $import = (() => {
    let name = args.join(' ')
    if(modules[name]) loaded.push(name)    
    else error(`Unknown module '${name}'`)
})