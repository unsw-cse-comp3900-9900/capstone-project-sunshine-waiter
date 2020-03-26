import jwtDecode from 'jwt-decode'

import BaseProvider from './BaseProvider'

export const getUser = (token, callback = () => {}) => {
  if (token !== undefined) {
    const decodedJWT = jwtDecode(token)
    const headerConfig = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = '/users/' + decodedJWT._id
    BaseProvider.get(URL, headerConfig)
      .then(res => {
        callback(res.data.data)
      })
      .catch(({ response }) => alert(response.data.error))
  }
}
