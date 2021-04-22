import app from './initExpress.js'
import initPagesRoutes from './routes/pages.js'

initPagesRoutes({ app })
app.listen(process.env.PORT ?? 3000)
