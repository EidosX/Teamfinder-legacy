import home from './pages/HomePage.js'
import recruitment from './pages/RecruitmentPage.js'
import newRecruitment from './pages/NewRecruitmentPage.js'

export default async function initPagesRoutes({ app }) {
  home({ app })
  recruitment({ app })
  newRecruitment({ app })
}
