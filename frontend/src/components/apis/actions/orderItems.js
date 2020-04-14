import BaseProvider from '../BaseProvider'

const getAllOrderItems = async (token, restaurantId) => {
  const config = {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/orderitems`
  const { data } = await BaseProvider.get(URL, config)
  return data.data
}

export const getAllCategories = async (token, restaurantId) => {
  const config = {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/json',
    },
  }
  const URL = `/restaurants/${restaurantId}/categories`
  const { data } = await BaseProvider.get(URL, config)
  return data.data
}

export default getAllOrderItems
