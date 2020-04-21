import { message } from 'antd'

import BaseProvider from '../BaseProvider'

export const createMenuItem = (
  token,
  restaurantId,
  param,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    const URL = `/restaurants/${restaurantId}/menuItems/`
    BaseProvider.post(URL, param, config)
      .then(res => {
        console.log({ res })
        message.success(res.statusText, 3)
        callback()
      })
      .catch(err => {
        console.log({ err })
        message.error(err.response.data.error, 3)
      })
  }
}

export const updateMenuItem = (
  token,
  restaurantId,
  menuItemId,
  param,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    const URL = `/restaurants/${restaurantId}/menuItems/${menuItemId}`
    BaseProvider.put(URL, param, config)
      .then(res => {
        message.success(res.data.message, 3)
        callback()
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}

export const deleteMenuItem = (
  token,
  restaurantId,
  menuItemId,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    const URL = `/restaurants/${restaurantId}/menuItems/${menuItemId}`
    BaseProvider.delete(URL, config)
      .then(res => {
        console.log({ res })
        message.success(res.data.message, 3)
        callback()
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}
