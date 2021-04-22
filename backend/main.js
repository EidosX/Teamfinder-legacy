import app from './httpApp.js'
import initPagesRoutes from './routes/pages.js'
import initGlobalHooks from './hooks/globalHooks.js'

initPagesRoutes({ app })
initGlobalHooks({ app })
app.listen(process.env.PORT ?? 3000)
