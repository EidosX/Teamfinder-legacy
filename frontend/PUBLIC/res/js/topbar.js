// This whole source file is why I like react
// (pretend html templates don't exist btw)
{
  const topBarDOM = document.createElement('div')
  topBarDOM.id = 'top-bar'
  // Unfortunately creating an svg procedurally doesn't work, so good ol' innerHtml
  topBarDOM.innerHTML +=
    '<svg class="logo"><image href="/res/svg/teamfinder-logo.svg" /></svg>'
  topBarDOM.append(makeSearchBar())
  topBarDOM.innerHTML +=
    '<svg class="user-icon"><image href="/res/svg/user.svg" /></svg>'

  document.write('<link rel="stylesheet" href="/res/css/topbar.css">')
  document.body.prepend(topBarDOM)

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
}
