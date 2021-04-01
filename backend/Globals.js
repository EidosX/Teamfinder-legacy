import express from 'express'
import yaml from 'js-yaml'
import fs from 'fs'
import database from './Database.js'

export const app = express()
app.use(express.urlencoded({ extended: true }))

export const db = await database('./db/database.db')

export const cfg = {
  server: yaml.load(fs.readFileSync('config/server.yml'))
}
