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
        console.log({ res })
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
