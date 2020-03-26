import cookie from 'react-cookies'

export const setCookie = (name, value, options = {}) => {
  cookie.save(name, value, options)
}

export const getCookie = (name, doNotParse = false) => {
  return cookie.load(name, doNotParse)
}

export const deleteCookie = (name, options = {}) => {
  cookie.remove(name, options)
}
