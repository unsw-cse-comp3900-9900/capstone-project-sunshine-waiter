import BaseProvider from '../BaseProvider'

export const fetchMenuApi = (restaurantId, callback = () => {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/menus`
  BaseProvider.get(URL, config)
    .then(res => {
      console.log('did fetch menus: ', { res })
      callback(res.data.data)
    })
    .catch(err => console.log({ err }))
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
        console.log('menus.js' + { res })
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
