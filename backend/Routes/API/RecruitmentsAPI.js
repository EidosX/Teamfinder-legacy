import { db, app } from '../../Globals.js'
import { error, success } from './JsonResponses.js'

app.get('/api/recruitments', async (req, res) => {
  res.send(await db('Recruitments'))
})

app.post('/api/recruitments', async (req, res) => {
  if (!req.body?.category_id || !req.body?.title || !req.body?.description) {
    error(res, 'Arguments category_id, title and description are mandatory')
    return
  }
  if (!(await db('Categories').where('id', '=', req.body.category_id)).length) {
    error(res, 'Category not found')
    return
  }
  if (!res.locals.user) {
    error(res, 'You must be connected to publish a recruitment')
    return
  }

  await db('Recruitments').insert({
    user_id: res.locals.user.id,
    category_id: req.body.category_id,
    title: req.body.title,
    description: req.body.description
  })
  success(res)
})
