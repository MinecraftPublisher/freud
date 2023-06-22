const __args = args.map(e => { try { return JSON.parse(e) } catch(k) { return e } })

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