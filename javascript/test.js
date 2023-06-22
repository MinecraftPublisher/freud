const freud = require('./dist')
const fs = require('fs')

freud(fs.readFileSync('main.fr', 'utf-8'))