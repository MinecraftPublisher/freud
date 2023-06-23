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

		let result = '"none"'

		let command = splits[0]
		let args = splits.slice(1)
		//* End variables

		let modules = {}

		_modules()
		cases()

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