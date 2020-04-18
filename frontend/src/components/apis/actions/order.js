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
        callback(res.data.data)
      })
      .catch(err => console.log({ err }))
  }
}

export const fetchOrderApi = (
  token,
  restaurantId,
  orderId,

  callback = () => {}
) => {
  const config = {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/orders/${orderId}`
  BaseProvider.get(URL, config)
    .then(res => {
      console.log('did fetch orders: ', { res })
      callback(res.data.data)
    })
    .catch(err => console.log({ err }))
}
