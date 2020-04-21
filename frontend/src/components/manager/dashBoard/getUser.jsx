import BaseProvider from '../../apis/BaseProvider.jsx'
import { getCookie } from '../../authenticate/Cookies'

const getUser = async userId => {
  const config = {
    headers: {
      'x-auth-token': getCookie('token'),
    },
  }
  const URL = `/users/${userId}`
  const { data } = await BaseProvider.get(URL, config)
  return data.data
}

export default getUser
