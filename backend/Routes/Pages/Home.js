import { app, root_dir } from '../../Globals.js'
import path from 'path'
app.get('/', (req, res) => {
  res.sendFile(path.join(root_dir, './frontend/html/index.html'))
})
