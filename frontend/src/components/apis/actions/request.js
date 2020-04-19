import BaseProvider from '../BaseProvider'

export const sendRequest = (
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
    const URL = `/restaurants/${restaurantId}/request/`
    BaseProvider.post(URL, param, config)
      .then(res => {
        console.log('request', { res })
        console.log('thisrequest', res.data.data._id)
        callback()
      })
      .catch(err => console.log({ err }))
  }
}
