//return true if a has exact some object not in b
export const compareTwoArrays = (a, b) => {
  const res = a.filter(
    ({ _id: id1, name: name1, description: des1 }) =>
      !b.some(
        ({ _id: id2, name: name2, description: des2 }) =>
          id1 === id2 && name1 === name2 && des1 === des2
      )
  )
  return res.length === 0
}
