import express from 'express'
import yaml from 'js-yaml'
import fs from 'fs'

const app = express()
const serverCfg = yaml.load(fs.readFileSync('config/server.yml'))

app.listen(serverCfg.port, () => {
  console.debug(`Teamfinder is running on port ${serverCfg.port}`)
})