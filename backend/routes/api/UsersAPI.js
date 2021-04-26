import { ok, err, okWith } from './ApiTools.js'
import bcrypt from 'bcrypt'
import { authHook } from '../../hooks/AuthHook.js'
import { Ranks } from '../../misc/Ranks.js'
import db from '../../database.js'

export default function usersAPI({ app }) {
  app.get('/api/users/', async (req, res) => {
    if (!parseInt(req.query.id)) return res.send(err("ID d'utilisateur invalide"))
    const user = await db('Users')
      .where('id', '=', req.query.id)
      .select('nickname', 'rank', 'profile_pic_url')
      .first()
    res.send(okWith(user))
  })
  app.post('/api/users', async (req, res) => {
    if (res.locals.user) return res.send(err('Vous etes déjà connecté'))
    const nickname = req.body.nickname
    const email = req.body.email
    const passwordPlain = req.body.password
    if (!nickname) return res.send(err('Le pseudonyme est obligatoire'))
    if (!email) return res.send(err("L'email est obligatoire"))
    if (!passwordPlain) return res.send(err('Le mot de passe est obligatoire'))

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(nickname))
      return res.send(err('Pseudonyme invalide'))
    const nickAlreadyTaken = await db('Users')
      .whereRaw('LOWER(Users.nickname) = ?', nickname.toLowerCase())
      .first()
    if (nickAlreadyTaken) return res.send(err('Ce pseudonyme a déjà été pris'))

    let emailAlreadyTaken = await db('Users')
      .whereRaw('LOWER(Users.email) = ?', email.toLowerCase())
      .first()
    if (emailAlreadyTaken) return res.send(err('Un compte existe déjà avec ce mail'))

    if (passwordPlain.length < 6) return res.send(err('Mot de passe trop court'))
    if (passwordPlain.length > 20) return res.send(err('Mot de passe trop long'))

    bcrypt.hash(req.body.password, 10, async (_err, password) => {
      await db('Users').insert({ nickname, email, password, rank: Ranks.DEFAULT })
    })

    res.send(ok())
  })
  app.delete('/api/users', authHook, async (req, res) => {
    if (!req.body.password)
      return res.send(
        err('Entrez votre mot de passe pour confirmer la suppression de votre compte')
      )

    if (!bcrypt.compareSync(req.body.password, res.locals.user.password))
      return res.send(err('Mot de passe invalide'))

    await db('Users').where({ id: res.locals.user.id }).del()
    delete req.session.userId
    return res.send(ok('Votre compte a été supprimé.'))
  })
}
