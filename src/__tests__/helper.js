const domino = require('domino')
const window = domino.createWindow('<html></html>', 'https://example.com/')
global.document = window.document
global.CustomEvent = window.CustomEvent
