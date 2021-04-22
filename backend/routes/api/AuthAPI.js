import { ok, err } from './ApiTools.js'
import bcrypt from 'bcrypt'
import db from '../../database.js'

export default function authAPI({ app }) {
  app.get('/api/auth', (req, res) =>
    res.send({ status: res.locals.user ? 'CONNECTED' : 'DISCONNECTED' })
  )
  app.post('/api/auth', async (req, res) => {
    if (res.locals.user) return res.send(ok())
    if (!req.body.nickname) return res.send(err('Le pseudonyme est obligatoire'))
    if (!req.body.password) return res.send(err('Le mot de passe est obligatoire'))
    const dbUser = await db('Users')
      .whereRaw('LOWER(nickname) = ?', req.body.nickname.toLowerCase())
      .select('password', 'id')
      .first()
    if (!dbUser) return res.send(err('Utilisateur introuvable'))

    if (!bcrypt.compareSync(req.body.password, dbUser.password))
      return res.send(err('Mot de passe invalide'))

    req.session.userId = dbUser.id
    res.send(ok())
  })
}
