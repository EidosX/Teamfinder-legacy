import auth from './api/AuthAPI.js'
import users from './api/UsersAPI.js'
import applications from './api/ApplicationsAPI.js'
import recruitments from './api/RecruitmentsAPI.js'

export default function initAPIRoutes({ app }) {
  auth({ app })
  users({ app })
  applications({ app })
  recruitments({ app })
}
