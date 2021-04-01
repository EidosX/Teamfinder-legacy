import { db, app } from '../../Globals.js'
import { Rank } from '../../Database.js'
import bcrypt from 'bcrypt'
import { error, success } from './JsonResponses.js'

app.get('/api/users', async (req, res) => {
  res.send(await db('Users'))
})

app.post('/api/users', async (req, res) => {
  if (!req?.body?.nickname || !req?.body?.email || !req?.body?.password) {
    error(res, 'You must provide nickname, email and password parameter')
    return
  }

  // Check nickname
  {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(req.body.nickname)) {
      error(res, 'Invalid username')
      return
    }

    let sameNicknames = await db('Users').whereRaw(
      'LOWER(Users.nickname) = ?',
      `${req.body.nickname.toLowerCase()}`
    )
    if (sameNicknames.length) {
      error(res, 'This nickname is already taken')
      return
    }
  }

  // Check email
  {
    let sameEmails = await db('Users').whereRaw(
      'LOWER(Users.email) = ?',
      `${req.body.email.toLowerCase()}`
    )
    if (sameEmails.length) {
      error(res, 'An account with that email already exists')
      return
    }
  }

  // Check password
  {
    if (req.body.password.length < 6) {
      error(res, 'Your password is too short')
      return
    }
    if (req.body.password.length > 20) {
      error(res, 'Your password is too long')
      return
    }
  }

  // If we made it here, then the nickname, email and password are valid!

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    await db('Users').insert({
      nickname: req.body.nickname,
      email: req.body.email,
      password: hash,
      rank: Rank.USER
    })
  })

  success(res)
})
