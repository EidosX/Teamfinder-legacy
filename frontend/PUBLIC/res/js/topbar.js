// This whole source file is why I like react
// (pretend html templates don't exist btw)
{
  let SWITCH_AUTH_LOGIN_STATE = true // False when 'Signin' is selected

  const topBarDOM = document.createElement('div')
  topBarDOM.id = 'top-bar'
  // Unfortunately creating an svg procedurally doesn't work, so good ol' innerHtml
  topBarDOM.innerHTML +=
    '<svg class="logo"><image href="/res/svg/teamfinder-logo.svg" /></svg>'
  topBarDOM.append(makeSearchBar())
  topBarDOM.innerHTML +=
    '<svg class="user-icon" id="topbar-user-icon"><image href="/res/svg/user.svg" /></svg>'

  document.write('<link rel="stylesheet" href="/res/css/topbar.css">')
  const authForm = makeAuthForm()
  document.body.prepend(authForm)
  document.body.prepend(topBarDOM)

  document.getElementById('topbar-user-icon').addEventListener('click', () => {
    authForm.classList.toggle('opened')
  })

  function makeSearchBar() {
    const divDOM = document.createElement('div')
    divDOM.className = 'search-bar'

    divDOM.innerHTML +=
      '<svg class="mag-glass icon"><image href="/res/svg/mag-glass.svg" /></svg>'
    divDOM.innerHTML +=
      '<svg class="arrow-right icon"><image href="/res/svg/arrow-right.svg" /></svg>'

    const inputDOM = document.createElement('input')
    inputDOM.type = 'text'
    inputDOM.name = 'searchQuery'
    inputDOM.placeholder = 'Rechercher'
    divDOM.append(inputDOM)

    return divDOM
  }
  function makeAuthForm() {
    const divDOM = document.createElement('div')
    divDOM.id = 'topbar-auth-form'

    // Ugly hack to prevent animation from playing immediately.
    divDOM.className = 'no-transition'
    setTimeout(() => divDOM.classList.remove('no-transition'), 250)

    const switchDOM = document.createElement('div')
    switchDOM.className = 'switch'
    divDOM.append(switchDOM)

    const switchSelectorDOM = document.createElement('div')
    switchSelectorDOM.className = 'selector'
    switchDOM.append(switchSelectorDOM)

    const loginDOM = document.createElement('p')
    loginDOM.innerText = 'Connexion'
    switchDOM.append(loginDOM)

    const signinDOM = document.createElement('p')
    signinDOM.innerText = 'Inscription'
    switchDOM.append(signinDOM)

    const usernameDOM = makeInput("Nom d'utilisateur")
    divDOM.append(usernameDOM)
    const emailDOM = makeInput('Adresse email')
    divDOM.append(emailDOM)
    const passwordDOM = makeInput('Mot de passe', true)
    divDOM.append(passwordDOM)
    const confirmationDOM = makeInput('Confirmation')
    divDOM.append(confirmationDOM)

    const sendButton = document.createElement('button')
    sendButton.className = 'send-button'
    divDOM.append(sendButton)

    let loginBtnCallback = () => {
      switchSelectorDOM.style.transform = 'translateX(0%)'
      emailDOM.classList.add('hidden')
      confirmationDOM.classList.add('hidden')
      passwordDOM.style.transform = 'translateY(-100%)'
      sendButton.innerText = 'Se connecter'
      divDOM.classList.remove('signin-mode')
      SWITCH_AUTH_LOGIN_STATE = true
    }
    loginDOM.onclick = loginBtnCallback
    signinDOM.onclick = () => {
      switchSelectorDOM.style.transform = 'translateX(100%)'
      emailDOM.classList.remove('hidden')
      confirmationDOM.classList.remove('hidden')
      passwordDOM.style.transform = 'translateY(0%)'
      sendButton.innerText = "S'inscrire"
      divDOM.classList.add('signin-mode')
      SWITCH_AUTH_LOGIN_STATE = false
    }
    loginBtnCallback()

    return divDOM

    function makeInput(placeholder, isPassword = false) {
      const divDOM = document.createElement('div')
      divDOM.className = 'input'

      const inputDOM = document.createElement('input')
      if (isPassword) inputDOM.type = 'password'
      divDOM.append(inputDOM)

      const placeholderDOM = document.createElement('p')
      placeholderDOM.className = 'placeholder'
      placeholderDOM.innerText = placeholder
      divDOM.prepend(placeholderDOM)

      inputDOM.addEventListener('keydown', () =>
        setTimeout(() => {
          if (inputDOM.value) {
            placeholderDOM.classList.add('above')
          } else {
            placeholderDOM.classList.remove('above')
          }
        }, 10)
      )

      return divDOM
    }
  }
}
