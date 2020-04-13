import { message } from 'antd'

import BaseProvider from '../BaseProvider'

export const sendInvitation = (
  token,
  restaurantId,
  params,
  callback = () => {}
) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
      },
    }
    const URL = `/restaurants/${restaurantId}/staff`

    BaseProvider.post(URL, params, config)
      .then(res => {
        callback()
        message.success(res.data.message, 2)
      })
      .catch(err => message.error(err.response.data.error))
  }
}

export const getStaffs = () => {}
