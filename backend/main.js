import app from './httpApp.js'
import initPagesRoutes from './routes/pages.js'
import initAPIRoutes from './routes/apis.js'
import initGlobalHooks from './hooks/globalHooks.js'

initGlobalHooks({ app })
initPagesRoutes({ app })
initAPIRoutes({ app })
app.listen(process.env.PORT ?? 3000)
