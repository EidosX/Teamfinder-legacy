import db from '../database.js'

export default function initGlobalHooks({ app }) {
  app.use(async (req, res, next) => {
    const id = req.session.userId
    if (id) res.locals.user = await db('Users').where('id', '=', id).first()
    next()
  })
}
