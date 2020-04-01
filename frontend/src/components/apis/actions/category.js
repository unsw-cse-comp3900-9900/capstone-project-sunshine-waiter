import BaseProvider from '../BaseProvider'

export const createCategoryItem = (
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
    const URL = `/restaurants/${restaurantId}/categories`
    BaseProvider.post(URL, param, config)
      .then(res => {
        console.log({ res })
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
