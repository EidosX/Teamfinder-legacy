import { cfg, app } from './Globals.js'

app.listen(cfg.server.port, () => {
  console.debug(`Teamfinder is running on port ${cfg.server.port}`)
})
