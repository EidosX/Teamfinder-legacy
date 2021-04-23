export const sendToErrorPage = (res, msg, url = '/') => {
  res.send('(TODO PAGE) Error: ' + msg)
}
