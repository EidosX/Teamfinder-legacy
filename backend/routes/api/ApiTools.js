export const ok = () => ({ status: 'OK' })
export const okWith = c => ({ status: 'OK', response: c })
export const err = msg => ({ status: 'ERROR', message: msg })
