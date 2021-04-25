import app, { io } from './server.js'
import initPagesRoutes from './routes/pages.js'
import initAPIRoutes from './routes/apis.js'
import initGlobalHooks from './hooks/globalHooks.js'
import initSocketIO from './socketio/initSocketIO.js'

initGlobalHooks({ app })
initPagesRoutes({ app })
initAPIRoutes({ app })
initSocketIO({ io })
