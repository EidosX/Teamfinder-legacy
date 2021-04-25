import express from 'express'
import path from 'path'
import SessionPlugin from 'express-session'
import { Server } from 'socket.io'

const app = express()
export default app

const session = SessionPlugin({
  secret: 'hurle chiale rugit',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
})

app.use(session)
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.resolve('views'))
app.use('/static', express.static('res/static'))

const server = app.listen(process.env.PORT ?? 3000)

export const io = new Server(server, {})
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(session))
