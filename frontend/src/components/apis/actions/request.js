import BaseProvider from '../BaseProvider'

export const sendRequest = (
  token,
  restaurantId,
  param,
  callback = () => {}
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/request/`
  BaseProvider.post(URL, param, config)
    .then((res) => {
      callback()
    })
    .catch((err) => console.log({ err }))
}
