const makeid = ((length) => {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    return result
})

let parts = []
let functions = []
let memory = {}

const bracket = ((text, start, end) => {
    let result = []

    let j = text.indexOf(start) + 1
    while (j !== 0) {
        j = text.indexOf(start) + 1

        let output = start
        text = text.substring(j)
        while (text.length !== 0 && !text.startsWith(end)) {
            output += text.charAt(0)
            text = text.substring(1)
        }

        output += end
        text = text.substring(1)
        result.push(output)
        j = text.indexOf(start) + 1
    }

    return result
})

let loaded = []

const freud = ((code, num = 1) => {
    let lines = code.split('\n')
    lines = lines.map((e) => {
        let o = e
        while (o.startsWith(' ')) o = o.substring(1)
        return o
    })

    let last = '"none"'
    for (let i = 0; i < lines.length; i++) {
        //* Start variables
        let line = lines[i]

        const call_array = bracket(line, '[', ']')
        for (let j = 0; j < call_array.length; j++) {
            let h = call_array[j]
            let __name = makeid(20)
            memory[__name] = freud(h.substring(1, h.length - 1), -(num + i)) ?? '"none"'
            line = line.replace(h, __name)
        }

        const variable_array = bracket(line, '{', '}')
        const call_bind = ((h) => ((g) => memory[g] ?? '"none"')(h.substring(1, h.length - 1)))

        for (let j = 0; j < variable_array.length; j++) {
            let h = variable_array[j]
            line = line.replace(h, JSON.parse(memory[h.substring(1, h.length - 1)] ?? '"none"'))
        }

        let splits = line.split(' ')
        let has_store = splits[0].startsWith('.')
        let name = has_store ? splits[0].substring(1) : ''
        if (has_store) splits = splits.slice(1)

        let result = 'none'

        let command = splits[0]
        let args = splits.slice(1)
        //* End variables

        let modules = {}

        //* BEGIN builtin/__unknown.js
        const error = ((err) => {
            console.log(`${err} at ${num < 0 ? `inline script at line ${i - num}`: `line ${i + num}`}! Line: "${line}"`)
            process.exit(1)

            return 1
        })

        const tryparse = ((x) => isNaN(parseFloat(x)) ? error(`Invalid number '${x}'`) : parseFloat(x))
        const unknown = (() => error(`Unknown command '${command}'`))
        const arch = (() => error(`Command '${command}' is not supported on this architecture`))
        //* END builtin/__unknown.js

        //? BEGIN builtin/_json.js
        //--jstring
        const jstring = (() => result = JSON.stringify(memory[args[0]]) ?? '"none"')
        //? END builtin/_json.js

        //! BEGIN builtin/_loop.js
        const unimplemented = ['void']
        const loop_list = ['while', 'for', 'if', 'ifnot']

        class loop_output {
            constructor(type, args, content) {
                this.type = type
                this.args = args
                this.content = content
            }
        }

        const loop = (() => {
            let loop_args = args.join(' ')
            let blocks = []

            i++
            let j = 0
            let block = lines[i]
            while ((block !== 'end' || j > 0) && i < lines.length) {
                if (block === 'end') j--
                blocks.push(block)
                if (loop_list.includes(block.split(' ')[0])) j++

                i++
                block = lines[i]
            }

            return new loop_output(command, loop_args, blocks.join('\n'))
        })
        //! END builtin/_loop.js

        //~ BEGIN builtin/_loops.js
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
        //~ END builtin/_loops.js

        //^ BEGIN builtin/_math.js
        //--$add
        const $add = (() => {
            let start = tryparse(args[0])
            for (let j = 1; j < args.length; j++) start += tryparse(args[j])
            result = start
        })

        //--multiply
        const multiply = (() => {
            let start = tryparse(args[0])
            for (let j = 1; j < args.length; j++) start *= tryparse(args[j])
            result = start
        })

        //--divide
        const divide = (() => {
            let start = tryparse(args[0])
            for (let j = 1; j < args.length; j++) start /= tryparse(args[j])
            result = start
        })
        //^ END builtin/_math.js

        //& BEGIN builtin/_operators.js
        const __args = args.map(e => {
            try {
                return JSON.parse(e)
            } catch (k) {
                return e
            }
        })

        //--more
        const more = (() => result = __args.reduce((a, b) => a > b))
        //--less
        const less = (() => result = __args.reduce((a, b) => a < b))
        //--equals
        const equals = (() => result = __args.reduce((a, b) => a == b))

        //--not
        const not = (() => result = (__args.join(' ') === '""' || __args.join(' ') === '0' || !__args.join(' ')))
        //--or
        const or = (() => result = __args.reduce((a, b) => a || b))
        //--and
        const and = (() => result = __args.reduce((a, b) => a && b))
        //& END builtin/_operators.js

        //* BEGIN import/_import.js
        //--$import
        const $import = (() => {
            let name = args.join(' ')
            if (modules[name]) loaded.push(name)
            else error(`Unknown module '${name}'`)
        })
        //* END import/_import.js

        //? BEGIN main/array.js
        const array = (() => result = args.map((e) => {
            try {
                return JSON.parse(e)
            } catch (k) {
                return e
            }
        }))
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
        //? END main/array.js

        //! BEGIN main/clear.js
        const clear = (() => {
            console.clear()
            result = ''
        })
        //! END main/clear.js

        //~ BEGIN main/echo.js
        const echo = (() => {
            console.log(args.join(' '))
            result = args.join(' ')
        })
        //~ END main/echo.js

        //^ BEGIN main/input.js
        const input = (() => {
            if (prompt) result = prompt(args.join(' '))
            else arch()
        })
        //^ END main/input.js

        //& BEGIN main/sleep.js
        const sleep = (() => {
            arch()
        })
        //& END main/sleep.js

        //* BEGIN main/str.js
        const str = (() => {
            result = args.join(' ')
        })
        //* END main/str.js

        //? BEGIN std/_fs.js
        const fs = {}

        const _fs = require('fs')
        const __temp = {
            read: _fs.readFileSync,
            write: _fs.writeFileSync,
            rm: _fs.rmSync,
            exists: _fs.existsSync
        }

        fs['read'] = (() => result = __temp.read(args.join(' '), 'utf-8'))
        fs['write'] = (() => result = __temp.write(args[0], args.slice(1).join(' ')))
        fs['rm'] = (() => __temp.rm(args.join(' ')))
        fs['exists'] = (() => result = __temp.exists(args.join(' ')))

        modules['fs'] = fs
        //? END std/_fs.js
        parts = ["jstring", "$while", "$for", "$if", "$ifnot", "$add", "multiply", "divide", "more", "less", "equals", "not", "or", "and", "$import", "array", "push", "join", "clear", "echo", "input", "sleep", "str"]
        functions = [jstring, $while, $for, $if, $ifnot, $add, multiply, divide, more, less, equals, not, or, and, $import, array, push, join, clear, echo, input, sleep, str]

        for (let mod of loaded) {
            parts = parts.concat(Object.keys(modules[mod]).map((e) => `${mod}.${e}`))
            functions = functions.concat(Object.keys(modules[mod]).map((e) => modules[mod][e]))
        }

        let index = parts.map((e) => e.startsWith('$') ? e.substring(1) : e).indexOf(command)
        if (line === '') continue
        if (index !== -1) functions[index]()
        else unknown()

        result = JSON.stringify(result) ?? '"none"'
        last = result
        if (has_store) memory[name] = result
    }

    return last
})

module.exports = freud