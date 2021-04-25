import express from 'express'
import path from 'path'
import session from 'express-session'
import { Server } from 'socket.io'

const app = express()
export default app

app.use(
  session({
    secret: 'hurle chiale rugit',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
)
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.resolve('views'))
app.use('/static', express.static('res/static'))

const server = app.listen(process.env.PORT ?? 3000)
export const io = new Server(server, {})
