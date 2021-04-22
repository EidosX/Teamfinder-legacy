import auth from './api/AuthAPI.js'
import users from './api/UsersAPI.js'

export default function initAPIRoutes({ app }) {
  auth({ app })
  users({ app })
}
