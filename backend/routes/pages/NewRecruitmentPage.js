import db from '../../database.js'
import { sendToErrorPage } from './../ViewTools.js'
import { authHook } from '../../hooks/AuthHook.js'

export default function recruitmentPage({ app }) {
  app.get('/new-recruitment', authHook, async (req, res) => {
    const categories = await db('Categories')
    res.render('new-recruitment', { categories })
  })
}
