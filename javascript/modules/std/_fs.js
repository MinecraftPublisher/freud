const fs = {}

/* if(!globalThis.__tempfs) globalThis.__tempfs = {}
const __temp = {
    read: ((name, value = 'utf-8') => globalThis.__tempfs[name]),
    write: ((name, value) => globalThis.__tempfs[name] = value),
    rm: (() => { delete globalThis.__tempfs[args.join(' ')] }),
    exists: ((name) => !!__tempfs[name])
} */

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