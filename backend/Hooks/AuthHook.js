import { db } from '../Globals.js'

export const authHook = async (req, res, next) => {
  const uid = req.session.userId
  if (!uid) {
    next()
    return
  }
  const user = await db('Users').where('Users.id', '=', uid).first()
  if (user) delete user.password
  res.locals.user = user
  next()
}
