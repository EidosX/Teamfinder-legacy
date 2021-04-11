import { db, app } from '../../Globals.js'
import { error, success } from './JsonResponses.js'

app.get('/api/applications', async (req, res) => {
  if (req.query.recruitment_id) {
    res.send(
      await db('Applications').where(
        'recruitment_id',
        '=',
        req.query.recruitment_id
      )
    )
    return
  }
  res.send(await db('Applications'))
})

app.post('/api/applications', async (req, res) => {
  if (!res.locals.user) {
    error(res, 'You must be connected to make an application')
    return
  }
  let recruitment_id = req.body?.recruitment_id
  let message = req.body?.message
  if (!recruitment_id || !message) {
    error(res, 'Arguments recruitment_id and message are mandatory')
    return
  }
  if (!(await db('Recruitments').where('id', '=', recruitment_id)).length) {
    error(res, 'Recruitment not found')
    return
  }
  if (
    (
      await db('Applications')
        .where('recruitment_id', '=', recruitment_id)
        .where('user_id', '=', res.locals.user.id)
    ).length
  ) {
    error(res, 'You already applied for this recruitment!')
    return
  }
  await db('Applications').insert({
    user_id: res.locals.user.id,
    recruitment_id,
    message
  })
  success(res)
})
