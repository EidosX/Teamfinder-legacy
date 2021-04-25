import { homePageMiddleware } from './pages/HomePage.js'
export const sendToErrorPage = (res, msg) => {
  res.locals.notifications = [{ message: msg, type: 'error' }]
  homePageMiddleware(res)
}
