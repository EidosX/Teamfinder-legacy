import express from 'express'
import path from 'path'

const app = express()
export default app

app.set('view engine', 'ejs')
app.set('views', path.resolve('views'))
app.use('/static', express.static('res/static'))
