import BaseProvider from '../BaseProvider'

export const sendInvitation = (
  token,
  restaurantId,
  params,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      'x-auth-token': token,
    }
    const URL = `/restaurants/${restaurantId}/staff`

    BaseProvider.post(URL, params, config)
      .then(res => {
        callback()
        console.log(res)
      })
      .catch(err => alert(err.response.data.error))
  }
}
