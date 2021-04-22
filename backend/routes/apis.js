import auth from './api/AuthAPI.js'

export default async function initAPIRoutes({ app }) {
  auth({ app })
}
