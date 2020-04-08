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
          alert('Backend server is dnow!')
        } else {
          alert(err.data.error)
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
          alert('Backend server is dnow!')
        } else {
          alert(err.data.error)
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
        alert(
          'Congrats restaurant ' +
            res.data.data.name +
            ' is ' +
            res.statusText +
            '!'
        )
      })
      .catch(err => console.log({ err }))
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
        callback()
        console.log('done', { res })
        alert(res.data.message)
      })
      .catch(err => console.log({ err }))
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
        alert(res.data.message)
      })
      .catch(err => console.log({ err }))
  }
}
