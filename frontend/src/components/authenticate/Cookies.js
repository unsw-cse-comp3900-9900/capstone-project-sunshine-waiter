import cookie from 'react-cookies'

export const getCookie = (name, doNotParse = false) => {
  return cookie.load(name, doNotParse)
}

export const deleteCookie = (name, options = {}) => {
  cookie.remove(name, options)
}

export const setCookie = (name, value, options = {}) => {
  if (getCookie('token') !== undefined) {
    deleteCookie('token')
  }
  cookie.save(name, value, options)
}
