import express from 'express'
import path from 'path'
import session from 'express-session'

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
