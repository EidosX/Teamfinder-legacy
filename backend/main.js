import app from './init/httpServer.js'
import initPagesRoutes from './routes/pages.js'
import _db from './init/database.js'

initPagesRoutes({ app })
app.listen(process.env.PORT ?? 3000)
