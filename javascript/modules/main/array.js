const array = (() => result = args.map((e) => { try { return JSON.parse(e) } catch(k) { return e } }))
const arrparse = ((e) => JSON.parse(e))

//--push
const push = (() => {
    result = arrparse(memory[args[0]]).concat(args.slice(1))
})

//--join
const join = (() => {
    let arr = [];
    args.map((e) => arr = arr.concat(arrparse(memory[e])))
    result = arr
})