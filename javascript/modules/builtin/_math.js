//--$add
const $add = (() => {
    let start = tryparse(args[0])
    for(let j = 1; j < args.length; j++) start += tryparse(args[j])
    result = start
})

//--multiply
const multiply = (() => {
    let start = tryparse(args[0])
    for(let j = 1; j < args.length; j++) start *= tryparse(args[j])
    result = start
})

//--divide
const divide = (() => {
    let start = tryparse(args[0])
    for(let j = 1; j < args.length; j++) start /= tryparse(args[j])
    result = start
})