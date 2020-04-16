import jwtDecode from 'jwt-decode'
import { message } from 'antd'

import BaseProvider from '../BaseProvider'
import { deleteCookie } from '../../authenticate/Cookies'

export const getUser = (token, userId = null, callback = () => {}) => {
  if (token !== undefined) {
    if (userId === null) {
      const decodedJWT = jwtDecode(token)
      userId = decodedJWT._id
    }

    const headerConfig = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = '/users/' + userId
    BaseProvider.get(URL, headerConfig)
      .then(res => {
        callback(res.data.data)
      })
      .catch(({ response }) => {
        if (response === undefined) {
          message.warning('Backend server is dnow!', 3)
        } else {
          message.error(response.data.error, 3)
        }
      })
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
        message.success(res.data.message, 3)
      })
      .catch(({ response }) => message.error(response.data.error, 3))
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
        message.success(res.data.message, 3)
      })
      .catch(({ response }) => {
        message.error(response.data.error, 3)
      })
  }
}

export const readMe = (token, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = '/users/me'
    BaseProvider.get(URL, config)
      .then(res => {
        callback(res.data.data)
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}
