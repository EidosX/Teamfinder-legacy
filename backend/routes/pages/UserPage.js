import { authHook } from '../../hooks/AuthHook.js'
import { sendToErrorPage } from '../ViewTools.js'
import db from '../../database.js'

export default function userPage({ app }) {
  const pageMiddleware = async (req, res, thisUser) => {
    const categories = await db('Categories')
    const recruitments = await db('Recruitments')
      .where('user_id', '=', thisUser.id)
      .orderBy('created', 'desc')
    res.render('user', { thisUser, recruitments, categories })
  }

  app.get('/users/me', authHook, (req, res) => pageMiddleware(req, res, res.locals.user))
  app.get('/users/:id', async (req, res) => {
    if (!parseInt(req.params.id)) return sendToErrorPage(res, "ID d'utilisateur invalide")
    const thisUser = await db('Users').where('id', '=', req.params.id).first()
    if (!thisUser) return sendToErrorPage(res, 'Utilisateur introuvable')
    await pageMiddleware(req, res, thisUser)
  })
}
