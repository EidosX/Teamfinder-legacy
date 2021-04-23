import auth from './api/AuthAPI.js'
import users from './api/UsersAPI.js'
import applicationsAPI from './api/ApplicationsAPI.js'

export default function initAPIRoutes({ app }) {
  auth({ app })
  users({ app })
  applicationsAPI({ app })
}
