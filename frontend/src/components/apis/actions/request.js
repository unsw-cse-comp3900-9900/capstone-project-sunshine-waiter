import BaseProvider from '../BaseProvider'

export const sendRequest = (restaurantId, param, callback = () => {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const URL = `/restaurants/${restaurantId}/request/`
  console.log({ message: 'jason mark', param, restaurantId, URL })
  BaseProvider.post(URL, param, config)
    .then((res) => {
      callback()
    })
    .catch((err) => console.log({ err }))
}
