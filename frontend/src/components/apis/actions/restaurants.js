import { message } from 'antd'

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
        callback(res.data.data)
      })
      .catch(err => {
        if (err === undefined) {
          message.warning('Backend server is dnow!', 3)
        } else {
          console.log('rs', { err })
          if (err.response !== undefined)
            message.error(err.response.data.error, 3)
        }
      })
  }
}

export const getSingleRestaurant = (token, id, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    BaseProvider.get(`/restaurants/${id}`, config)
      .then(res => {
        callback(res.data.data)
      })
      .catch(err => {
        if (err === undefined) {
          message.warning('Backend server is down!', 3)
        } else {
          console.log('rashdai', { err })
          if (err.response !== undefined)
            message.error(err.response.data.error, 3)
        }
      })
  }
}

export const createRestaurant = (token, param, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    BaseProvider.post('/restaurants', param, config)
      .then(res => {
        callback()
        message.success(
          'Congrats restaurant ' +
            res.data.data.name +
            ' is ' +
            res.statusText +
            '!',
          3
        )
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}

export const deleteRestaurant = (token, id, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    BaseProvider.delete('/restaurants/' + id, config)
      .then(res => {
        // await callback()

        message.success(res.data.message, 3)
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}

export const updateRestaurant = (token, id, param, callback = () => {}) => {
  if (token !== undefined) {
    const config = {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    }
    BaseProvider.put('/restaurants/' + id, param, config)
      .then(res => {
        callback()
        message.success(res.data.message, 3)
      })
      .catch(err => message.error(err.response.data.error, 3))
  }
}
