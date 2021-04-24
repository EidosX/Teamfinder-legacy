import home from './pages/HomePage.js'
import search from './pages/SearchPage.js'
import recruitment from './pages/RecruitmentPage.js'
import newRecruitment from './pages/NewRecruitmentPage.js'
import user from './pages/UserPage.js'

export default async function initPagesRoutes({ app }) {
  home({ app })
  search({ app })
  recruitment({ app })
  newRecruitment({ app })
  user({ app })
}
