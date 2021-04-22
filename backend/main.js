import app from './initExpress.js'
import initPagesRoutes from './routes/pages.js'
import _db from './initDB.js'

initPagesRoutes({ app })
app.listen(process.env.PORT ?? 3000)
