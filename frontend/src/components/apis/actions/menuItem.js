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
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
