import { err } from '../routes/api/ApiTools.js'
import { sendToErrorPage } from '../routes/ViewTools.js'
export const authHookJson = (req, res, next) =>
  res.locals.user ? next() : res.send(err('Acces non autorisé'))
export const authHook = (req, res, next) =>
  res.locals.user ? next() : sendToErrorPage(res, 'Acces non autorisé')
