onLoginEvents.push(() => {
  if (myNickname === thisUserNickname) document.location.reload(true)
})
onDisconnectEvents.push(() => {
  if (hasModifyRights) document.location.reload(true)
})
