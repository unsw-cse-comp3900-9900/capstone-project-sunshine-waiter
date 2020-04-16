import jwtDecode from 'jwt-decode'
import { getCookie } from './authenticate/Cookies'

//return true if a has exact some object not in b
export const compareTwoArraysOfRestMetaObj = (a, b) => {
  const res = a.filter(
    ({ _id: id1, name: name1, description: des1 }) =>
      !b.some(
        ({ _id: id2, name: name2, description: des2 }) =>
          id1 === id2 && name1 === name2 && des1 === des2
      )
  )
  return res.length === 0
}

export const compareTwoArraysOfInvitationObj = (a, b) => {
  const res = a.filter(
    ({ restaurant: restaurantId1, role: role1 }) =>
      !b.some(
        ({ restaurant: restaurantId2, role: role2 }) =>
          restaurantId1 === restaurantId2 && role1 === role2
      )
  )
  return res.length === 0
}

export const handleAuthority = ({ userGroups }, page, callback = () => {}) => {
  const { owner, manager, cook, waiter } = userGroups
  const userId = jwtDecode(getCookie('token'))._id

  if (page === 'manager' || page === 'customer') {
    if (owner.includes(userId) || manager.includes(userId)) {
      callback()
    }
  }

  if (page === 'cook') {
    if (
      owner.includes(userId) ||
      manager.includes(userId) ||
      cook.includes(userId)
    ) {
      callback()
    }
  }

  if (page === 'waiter') {
    if (
      owner.includes(userId) ||
      manager.includes(userId) ||
      waiter.includes(userId)
    ) {
      callback()
    }
  }
}
