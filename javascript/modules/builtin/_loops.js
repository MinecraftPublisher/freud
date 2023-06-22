//--$while
const $while = (() => {
    let data = loop()

    while (JSON.parse(memory[data.args])) freud(data.content, num + i)
})

const sgn = ((x) => x === 0 ? 0 : (Math.abs(x) / x))

//--$for
const $for = (() => {
    let data = loop()
    let variable = args[0]
    let from = tryparse(args[1])
    let to = tryparse(args[2])
    let counter = sgn(to - from)

    if (counter === 0) error(`For loop iterator has 0 values at line ${i + num}`)

    for (let j = from; counter === 1 ? j <= to : j >= to; j += counter) {
        memory[variable] = JSON.stringify(j)
        freud(data.content, num + i)
    }
})

//--$if
const $if = (() => {
    let data = loop()

    if (memory[data.args]) freud(data.content, num + i)
})

//--$ifnot
const $ifnot = (() => {
    let data = loop()

    if (memory[data.args]) freud(data.content, num + i)
})