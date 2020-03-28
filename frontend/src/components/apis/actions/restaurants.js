import jwtDecode from 'jwt-decode'

import BaseProvider from '../BaseProvider'
// import { deleteCookie } from '../../authenticate/Cookies'

export const getRestaurants = (token, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    BaseProvider.get('/restaurants', config)
      .then(res => {
        // callback(res.data.data)
        callback([
          {
            _id: '1',
            name: 'test',
            description: 'test',
          },
        ])
      })
      .catch(err => console.log({ err }))
  }
}
