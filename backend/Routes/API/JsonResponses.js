export const error = (res, msg) => {
  res.send({
    status: 'ERROR',
    error: msg
  })
}

export const success = res => res.send({ status: 'OK' })
