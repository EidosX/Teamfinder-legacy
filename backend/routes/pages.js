export default function initPagesRoutes({ app }) {
  app.get('/', (req, res) => res.render('home'))
}
