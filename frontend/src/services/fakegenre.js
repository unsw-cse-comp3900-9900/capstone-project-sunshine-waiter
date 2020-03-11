export const categories = [
  { _id: '1', name: 'Sandwich' },
  { _id: '2', name: 'Pasta' },
]

export function getCategories() {
  return categories.filter(g => g)
}
