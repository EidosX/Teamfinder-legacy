import { err } from '../routes/api/ApiTools.js'
const authHook = (req, res, next) =>
  res.locals.user ? next() : res.send(err('Unauthorized access'))
export default authHook
