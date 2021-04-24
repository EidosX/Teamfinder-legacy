var onLoginEvents = []
var onDisconnectEvents = []
var myNickname = null

{
  const htmlSrc = `
  <div id=topbar>
    <a href="/">
      <svg class="teamfinder logo"><image href="/static/svg/teamfinder-logo.svg" /></svg>
    </a>
    <form class=search-bar id="topbar-search-bar">
      <svg class="mag-glass icon"><image href="/static/svg/mag-glass.svg" /></svg>
      <svg class="arrow-right icon" id="topbar-submit-btn"><image href="/static/svg/arrow-right.svg" /></svg>
      <input placeholder="Rechercher" name="search"></input>
    </form>
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

  // Search bar

  function performSearch() {
    const search = document.getElementById('topbar-search-bar').elements.search.value
    if (!search) return
    window.location.href = '/search/' + encodeURI(search)
  }
  document.getElementById('topbar-search-bar').onsubmit = e => {
    e.preventDefault()
    performSearch()
  }
  document.getElementById('topbar-submit-btn').onclick = () => performSearch()

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
        formDOM.onsubmit = async e => {
          e.preventDefault()
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(e.target)).toString()
          }).then(r => r.json())
          if (response.status === 'ERROR') return notify(response.message, 'error')
          notify('Vous etes connecté!', 'ok')
          setUserMenuState('connected')
          myNickname = e.target.elements.nickname.value
          onLoginEvents.forEach(f => f())
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
        formDOM.onsubmit = async e => {
          e.preventDefault()
          if (e.target.elements.password.value !== e.target.elements.confirmation.value)
            return notify('Le mot de passe ne correspond pas à la confirmation', 'error')
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(e.target)).toString()
          }).then(r => r.json())
          if (response.status === 'ERROR') return notify(response.message, 'error')
          notify('Vôtre compte a été crée!', 'ok')
          setTimeout(() => {
            notify('Vous pouvez maintenant vous connecter', 'info', 6000)
          }, 1000)
          setUserMenuState('login')
        }
        return formDOM
      }
      if (state === 'connected') {
        const divDOM = document.createElement('div')
        divDOM.id = 'user-menu-connected'
        divDOM.innerHTML = `
          <button class="profile">Mon profil <svg class="icon"><image href="/static/svg/edit.svg" /></svg></button>
          <button class="disconnect">Se deconnecter <svg class="icon"><image href="/static/svg/cross.svg" /></svg></button>
        `
        divDOM.querySelector('.disconnect').onclick = async e => {
          const response = await fetch('/api/auth', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(r => r.json())
          if (response.status === 'ERROR') return notify(response.message, 'error')
          notify('Vous avez bien été déconnecté.', 'info')
          setUserMenuState('login')
          myNickname = null
          onDisconnectEvents.forEach(f => f())
        }
        divDOM.querySelector('.profile').onclick = () => {
          window.location.href = '/users/me'
        }
        return divDOM
      }
    }
  }

  /* Placeholder float events */
  document.addEventListener('keydown', e => {
    if (!e.target.matches('#user-menu input')) return
    setTimeout(() => {
      const placeholderDOM = e.target.parentNode.querySelector('.placeholder')
      if (e.target.value ?? 0) placeholderDOM?.classList.add('above')
      else placeholderDOM.classList.remove('above')
    }, 0)
  })
}
