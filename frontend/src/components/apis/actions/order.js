import BaseProvider from '../BaseProvider'

export const createOrder = (
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
    const URL = `/restaurants/${restaurantId}/orders/`
    BaseProvider.post(URL, param, config)
      .then(res => {
        console.log('thisisorder', { res })
        console.log('thisorder->id', res.data.data._id)
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
