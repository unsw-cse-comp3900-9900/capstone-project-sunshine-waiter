import { message } from 'antd'

import BaseProvider from '../BaseProvider'

//This is the api to fetch private menus
export const fetchMenuApi = (token, restaurantId, callback = () => {}) => {
  const config = {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/menus`
  BaseProvider.get(URL, config)
    .then(res => {
      console.log('did fetch menus: ', { res })
      callback(res.data.data)
    })
    .catch(err => message.error(err.response.data.error, 3))
}

export const fetchPublicMenuApi = (restaurantId, callback = () => {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/menus/public`
  BaseProvider.get(URL, config)
    .then(res => {
      console.log('did fetch menus public: ', { res })
      callback(res.data.data)
    })
    .catch(err => console.log('fetch', { err }))
}

export const updateMenuApi = (
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
    const URL = `/restaurants/${restaurantId}/menus`
    BaseProvider.put(URL, param, config)
      .then(res => {
        message.success(res.data.message, 3)
        callback()
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}
