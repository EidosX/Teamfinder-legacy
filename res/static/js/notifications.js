// type can be info, error or ok
const notify = (message, type = 'info', time = 6000) => {
  const notifDOM = document.createElement('div')
  notifDOM.className = 'notification'
  notifDOM.innerHTML = `
    <svg class="icon"><image href="/static/svg/${type}-icon.svg" /></svg>
    <p class="message">${message}</p>
    <svg class="close icon"><image href="/static/svg/cross-no-bg.svg" /></svg>
  `
  const notificationsDOM = document.getElementById('notifications')
  const ghostDOM = document.createElement('div')
  ghostDOM.className = 'ghost'
  notificationsDOM.append(notifDOM, ghostDOM)
  setTimeout(() => {
    notifDOM.classList.add('proper-pos')
  }, 0)
  ghostDOM.style.height = 6 + notifDOM.getBoundingClientRect().height + 'px'
  notifDOM.style.position = 'absolute'

  let timeoutTask2 = null
  const killNotification = () => {
    notifDOM.classList.remove('proper-pos')
    ghostDOM.style.height = '0'

    timeoutTask2 = setTimeout(() => {
      notificationsDOM.removeChild(notifDOM)
      notificationsDOM.removeChild(ghostDOM)
    }, 1000)
  }
  let timeoutTask1 = setTimeout(killNotification, time)
  notifDOM.querySelector('.close.icon').onclick = () => {
    clearTimeout(timeoutTask1)
    clearTimeout(timeoutTask2)
    killNotification()
  }
}

const notificationsDOM = document.createElement('div')
notificationsDOM.id = 'notifications'
document.body.prepend(notificationsDOM)
document.write('<link rel="stylesheet" href="/static/css/notifications.css">')
