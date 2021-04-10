import express from 'express'
import yaml from 'js-yaml'
import fs from 'fs'
import session from 'express-session'
import database from './Database.js'
import { authHook } from './Hooks/AuthHook.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

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
app.use(authHook)
app.use(express.static('frontend/PUBLIC'))

export const db = await database('./db/database.db')

export const cfg = {
  server: yaml.load(fs.readFileSync('config/server.yml'))
}

// Yeah, that's the best I can do ... XD
export const root_dir = dirname(dirname(fileURLToPath(import.meta.url)))
