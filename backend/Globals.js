import express from 'express'
import yaml from 'js-yaml'
import fs from 'fs'
import session from 'express-session'
import database from './Database.js'

export const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'MAIS POURQUOIII',
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false,
    saveUninitialized: false
  })
)

export const db = await database('./db/database.db')

export const cfg = {
  server: yaml.load(fs.readFileSync('config/server.yml'))
}
