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