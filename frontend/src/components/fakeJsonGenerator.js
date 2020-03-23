// copy the following code (without const name) to https://www.json-generator.com/
const fakeDishes = [
  '{{repeat(20, 20)}}',
  {
    _id: '{{objectId()}}',
    name: function(tags) {
      var fruits = [
        'apple',
        'banana',
        'strawberry',
        'egg',
        'burger',
        'beef',
        'lamb',
        'chicken',
      ]
      return fruits[tags.integer(0, fruits.length - 1)]
    },
    readyTime:
      '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}',
    tableId: function(tags) {
      var fruits = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08']
      return fruits[tags.integer(0, fruits.length - 1)]
    },
    orderId: 'o'.concat('{{objectId()}}'),
    state: 'READY',
    serveTime: null,
  },
]

const fakeRequests = [
  '{{repeat(20, 20)}}',
  {
    _id: '{{objectId()}}',
    receiveTime: '{{date(new Date(2014, 0, 1), new Date(), "hh:mm:ss")}}',
    tableId: function(tags) {
      var fruits = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08']
      return fruits[tags.integer(0, fruits.length - 1)]
    },
    finishTime: null,
  },
]
