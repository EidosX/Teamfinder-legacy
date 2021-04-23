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
  <div id="topbar-ghost"></div>
  <div id="user-menu" class="hidden">
    <div id="user-menu-ghost"></div>
  </div>
  `
  // Inject into html
  document.write('<link rel="stylesheet" href="/static/css/topbar.css">')
  document.body.innerHTML = htmlSrc + document.body.innerHTML

  // User Menu

  document.querySelector('.user.logo').addEventListener('click', () => {
    document.getElementById('user-menu').classList.toggle('hidden')
  })
  // Dirty hack to avoid animation triggering immediately
  setInterval(() => {
    document.getElementById('user-menu').classList.add('with-transition')
  }, 50)

  fetch('/api/auth')
    .then(r => r.json())
    .then(r => setUserMenuState(r.status === 'CONNECTED' ? 'connected' : 'login'))

  function setUserMenuState(state) {
    const userMenuDOM = document.getElementById('user-menu')
    userMenuDOM.childNodes.forEach(e => {
      if (e.id === 'user-menu-ghost') return
      e.classList?.remove('proper-pos')
      e.classList?.add('hidden-pos')
      setTimeout(() => {
        if (userMenuDOM.contains(e)) userMenuDOM.removeChild(e)
      }, 1000)
    })
    const containerDOM = makeContainer()
    userMenuDOM.prepend(containerDOM)
    const newHeight = containerDOM.getBoundingClientRect().height + 'px'
    document.getElementById('user-menu-ghost').style.height = newHeight
    setTimeout(() => containerDOM.classList.add('proper-pos'), 0)

    function makeContainer() {
      if (state === 'login') {
        const formDOM = document.createElement('form')
        formDOM.innerHTML = `
          <div class="input">
            <p class="placeholder">Pseudonyme</p>
            <input type="text" name="nickname">
          </div>
          <div class="input">
            <p class="placeholder">Mot de passe</p>
            <input type="password" name="password">
          </div>
          <div class="input">
            <input type="submit" value="Se connecter">
          </div>
          <button class=signup-instead>Pas de compte?</button>
        `
        formDOM.querySelector('.signup-instead').onclick = e => {
          setUserMenuState('signup')
          e.preventDefault()
        }
        return formDOM
      }
      if (state === 'signup') {
        const formDOM = document.createElement('form')
        formDOM.innerHTML = `
          <div class="input">
            <p class="placeholder">Pseudonyme</p>
            <input type="text" name="nickname">
          </div>
          <div class="input">
            <p class="placeholder">Adresse email</p>
            <input type="email" name="email">
          </div>
          <div class="input">
            <p class="placeholder">Mot de passe</p>
            <input type="password" name="password">
          </div>
          <div class="input">
            <p class="placeholder">Confirmation</p>
            <input type="password" name="confirmation">
          </div>
          <div class="input">
            <input type="submit" value="S'inscrire">
          </div>
          <button class=login-instead>Déjà un compte?</button>
        `
        formDOM.querySelector('.login-instead').onclick = e => {
          setUserMenuState('login')
          e.preventDefault()
        }
        return formDOM
      }
      if (state === 'connected') {
        const divDOM = document.createElement('div')
        divDOM.innerHTML = `
          <button>Mon profil</button>
        `
        return divDOM
      }
    }
  }

  /* Placeholder float events */
  document.addEventListener('keydown', e => {
    if (!e.target.matches('#user-menu input')) return
    setTimeout(() => {
      const placeholderDOM = e.target.parentNode.querySelector('.placeholder')
      if (e.target.value ?? 0) placeholderDOM.classList.add('above')
      else placeholderDOM.classList.remove('above')
    }, 0)
  })
}
