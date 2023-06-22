const error = ((err) => {
    console.log(`${err} at ${num < 0 ? `inline script at line ${i - num}`: `line ${i + num}`}! Line: "${line}"`)
    process.exit(1)

    return 1
})

const tryparse = ((x) => isNaN(parseFloat(x)) ? error(`Invalid number '${x}'`) : parseFloat(x))
const unknown = (() => error(`Unknown command '${command}'`))
const arch = (() => error(`Command '${command}' is not supported on this architecture`))