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
})

onLoginEvents.push(() => {
  document.getElementById('new-recruitment-button').classList.remove('hidden')
})
onDisconnectEvents.push(() => {
  document.getElementById('new-recruitment-button').classList.add('hidden')
})
