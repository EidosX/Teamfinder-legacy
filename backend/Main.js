import express from 'express'
import yaml from 'js-yaml'
import fs from 'fs'
import database from './Database.js'

const app = express()

const serverCfg = yaml.load(fs.readFileSync('config/server.yml'))
const db = database('./db/database.db')

app.listen(serverCfg.port, () => {
  console.debug(`Teamfinder is running on port ${serverCfg.port}`)
})
