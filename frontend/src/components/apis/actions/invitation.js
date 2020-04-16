import { message } from 'antd'
import jwtDecode from 'jwt-decode'

import BaseProvider from '../BaseProvider'

export const sendInvitation = (
  token,
  restaurantId,
  params,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = `/restaurants/${restaurantId}/staff`

    BaseProvider.post(URL, params, config)
      .then(res => {
        callback()
        message.success(res.data.message, 2)
      })
      .catch(err => message.error(err.response.data.error))
  }
}

export const acceptInvitation = (token, params) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const userId = decodedJWT._id

    const config = {
      headers: {
        'x-auth-token': token,
      },
    }

    const URL = `/users/${userId}/roles`
    BaseProvider.post(URL, params, config)
      .then(res => {
        message.success(res.data.message, 3)
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}

export const resignRole = (token, data) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const userId = decodedJWT._id

    //axios delete has it own rule to take a data body
    const config = {
      headers: {
        'x-auth-token': token,
      },
      data: data,
    }

    const URL = `/users/${userId}/roles?`
    //delete doesn't have body
    BaseProvider.delete(URL, config)
      .then(res => {
        message.success(res.data.message, 4)
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}
