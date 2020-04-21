import BaseProvider from '../BaseProvider'

export const createOrder = (restaurantId, param, callback = () => {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/orders/`

  BaseProvider.post(URL, param, config)
    .then((res) => {
      callback(res.data.data)
    })
    .catch((err) => {
      console.log({ err })
    })
}

export const fetchOrderApi = (restaurantId, orderId, callback = () => {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/orders/${orderId}`
  BaseProvider.get(URL, config)
    .then((res) => {
      console.log('did fetch orders: ', { res })
      callback(res.data.data)
    })
    .catch((err) => console.log({ err }))
}
