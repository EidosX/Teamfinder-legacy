import { ok, err } from './ApiTools.js'
import { authHookJson } from '../../hooks/AuthHook.js'
import db from '../../database.js'

export default function recruitmentsAPI({ app }) {
  app.post('/api/recruitments', authHookJson, async (req, res) => {
    const category_id = req.body.category_id
    const title = req.body.title
    const description = req.body.description

    if (!category_id) return res.send(err('Vous devez preciser une categorie'))
    if (!title) return res.send(err('Vous devez donner un titre à votre recrutement'))
    if (!description)
      return res.send(err('Vous devez donner une description de votre recrutement'))

    await db('Recruitments').insert({
      category_id,
      title,
      description,
      user_id: res.locals.user.id
    })
    res.send(ok())
  })
}
