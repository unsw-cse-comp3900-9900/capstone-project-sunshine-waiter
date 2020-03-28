import jwtDecode from 'jwt-decode'

import BaseProvider from '../BaseProvider'
import { deleteCookie } from '../../authenticate/Cookies'

export const getUser = (token, callback = () => {}) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const headerConfig = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = '/users/' + decodedJWT._id
    BaseProvider.get(URL, headerConfig)
      .then(res => {
        callback(res.data.data)
      })
      .catch(({ response }) => alert(response.data.error))
  }
}

export const updateUser = (token, param) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const headerConfig = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = '/users/' + decodedJWT._id
    BaseProvider.put(URL, param, headerConfig)
      .then(res => {
        console.log(res)
      })
      .catch(({ response }) => alert(response.data.error))
  }
}

//if a user delete himself, then the page should go to unsigned in
export const deleteUser = (token, callback = () => {}) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const headerConfig = {
      headers: {
        'x-auth-token': token,
      },
    }

    const URL = '/users/' + decodedJWT._id
    BaseProvider.delete(URL, headerConfig)
      .then(res => {
        callback(null, false)
        deleteCookie('token')
      })
      .catch(({ response }) => {
        alert(response.data.error)
      })
  }
}
