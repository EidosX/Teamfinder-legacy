{
  const htmlSrc = `
  <div id=topbar>
    <svg class="teamfinder logo"><image href="/static/svg/teamfinder-logo.svg" /></svg>
    <div class=search-bar>
      <svg class="mag-glass icon"><image href="/static/svg/mag-glass.svg" /></svg>
      <svg class="arrow-right icon"><image href="/static/svg/arrow-right.svg" /></svg>
      <input placeholder="Rechercher"></input>
    </div>
    <svg class="user logo"><image href="/static/svg/user.svg" /></svg>
  </div>
  `
  // Inject into html
  document.write('<link rel="stylesheet" href="/static/css/topbar.css">')
  document.body.innerHTML = htmlSrc + document.body.innerHTML
}
