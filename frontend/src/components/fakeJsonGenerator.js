const dummyjson = require('dummy-json')
const { date } = require('dummy-json/lib/helpers')

const myHelpers = {
  food: () =>
    dummyjson.utils.randomArrayItem([
      'Beef',
      'Lamb',
      'Egg',
      'Burger',
      'Coffee',
      'Apple',
      'Coke',
      'Chicken',
    ]),
}

var fs = require('fs')
var template = fs.readFileSync('frontend/src/components/fakeDataTemplate.hbs', {
  encoding: 'utf8',
})
var result = dummyjson.parse(template, { helpers: myHelpers })

console.log(result)
