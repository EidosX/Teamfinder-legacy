import db from '../database.js'
import { sendToErrorPage } from './ViewTools.js'
import { authHook } from '../hooks/AuthHook.js'
import { ApplicationStatus } from '../misc/Applications.js'

export default async function initPagesRoutes({ app }) {
  app.get('/', async (req, res) => {
    const categories = await db('Categories')
    const recruitments = await db('Recruitments')
    const users = await db('Users') // TODO: filter only needed
    res.render('home', { categories, recruitments, users })
  })
  app.get('/recruitment/:id', async (req, res) => {
    if (!parseInt(req.params.id)) return sendToErrorPage(res, 'ID Invalide')
    const recruitment = await db('Recruitments').where('id', '=', req.params.id).first()
    if (!recruitment) return sendToErrorPage(res, 'Recrutement introuvable')
    const applications = await db('Applications')
      .where('recruitment_id', '=', recruitment.id)
      .orderBy('created', 'desc')
    const categories = await db('Categories')
    const users = await db('Users') // TODO: Filter only needed
    res.render('recruitment', { recruitment, users, categories, applications })
  })

  app.post('/recruitment/:id', authHook, async (req, res) => {
    const recruitment = await db('Recruitments').where('id', '=', req.params.id).first()
    if (!recruitment) return sendToErrorPage(res, 'Recrutement introuvable', thisUrl)
    const thisUrl = '/recruitment/' + recruitment.id
    if (!req.body.message)
      return sendToErrorPage(res, 'Vous devez entrer un message', thisUrl)
    await db('Applications').insert({
      user_id: res.locals.user.id,
      recruitment_id: recruitment.id,
      message: req.body.message,
      status: ApplicationStatus.WAITING
    })
    res.redirect(thisUrl)
  })
}
