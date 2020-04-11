const dummyjson = require('dummy-json')
const { date } = require('dummy-json/lib/helpers')

const PATH = 'backend/dummyData/'

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

// var template = fs.readFileSync('./fakeDataTemplate.hbs', {
//   encoding: 'utf8',
// })
// var result = dummyjson.parse(template, { helpers: myHelpers })

// console.log(result)

//users orders
var template = fs.readFileSync(PATH + 'dummyOrderTemplate.hbs', {
  encoding: 'utf8',
})
var result = dummyjson.parse(template)
fs.writeFile(PATH + 'dummyOrders.json', result, function (err) {
  if (err) {
    console.log(err)
  }
})

// dummy users
var template = fs.readFileSync(PATH + 'dummyUserTemplate.hbs', {
  encoding: 'utf8',
})
var result = dummyjson.parse(template)
fs.writeFile(PATH + 'dummyUsers.json', result, function (err) {
  if (err) {
    console.log(err)
  }
})
