/* Handle category selection */

const selectedCategoryIds = []

document.getElementById('category-selector').addEventListener('click', e => {
  if (!e.target.matches('.category')) return
  const id = parseInt(e.target.dataset.id)
  if (!selectedCategoryIds.includes(id)) {
    selectedCategoryIds.push(id)
    e.target.classList.add('selected')
  } else {
    selectedCategoryIds.splice(selectedCategoryIds.indexOf(id), 1)
    e.target.classList.remove('selected')
  }
  onCategorySelection()
})

onLoginEvents.push(() => {
  document.getElementById('new-recruitment-button').classList.remove('hidden')
})
onDisconnectEvents.push(() => {
  document.getElementById('new-recruitment-button').classList.add('hidden')
})

function onCategorySelection() {
  const feedDOM = document.getElementById('recruitment-feed')
  if (!selectedCategoryIds.length) {
    Array.from(feedDOM.children).forEach(e => e.classList.remove('hidden'))
  } else {
    Array.from(feedDOM.children).forEach(e => {
      Array.from(feedDOM.children).forEach(e => e.classList.add('hidden'))
      selectedCategoryIds.forEach(id => {
        for (const elem of feedDOM.getElementsByClassName('category' + id))
          elem.classList.remove('hidden')
      })
    })
  }
}
