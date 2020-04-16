import { getCookie } from './authenticate/Cookies'
import BaseProvider from './apis/BaseProvider'

const getCurrentUser = async () => {
  const jwt = getCookie('token')
  console.log(jwt)

  const config = {
    headers: {
      'x-auth-token': jwt,
    },
  }
  const URL = `users/me/`
  const { data } = await BaseProvider.get(URL, config)
  return { ...data.data, jwt }
}

export default getCurrentUser
