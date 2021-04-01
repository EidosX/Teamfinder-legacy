import { db, app } from '../../Globals.js'
import { error, success } from './JsonResponses.js'
import bcrypt from 'bcrypt'

app.post('/api/auth', async (req, res) => {
  if (res.locals.user) {
    success(res)
    return
  }
  if (!req?.body?.nickname || !req?.body?.password) {
    error(res, 'nickname and password parameters are mandatory')
    return
  }
  const dbResponse = await db('Users')
    .whereRaw('LOWER(Users.nickname) = ?', `${req.body.nickname.toLowerCase()}`)
    .select('Users.password as passwordHash', 'Users.id as userId')
    .first()
  if (!dbResponse) {
    error(res, 'User not found')
    return
  }
  const { userId, passwordHash } = dbResponse
  if (!bcrypt.compareSync(req.body.password, passwordHash)) {
    error(res, 'Invalid password')
    return
  }

  req.session.userId = userId
  success(res)
})

app.delete('/api/auth', (req, res) => {
  delete req.session.userId
  success(res)
})
