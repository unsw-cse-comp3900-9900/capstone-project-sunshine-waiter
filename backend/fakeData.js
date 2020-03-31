const fakeData = {
  dishes: [
    {
      _id: 0,
      menuItem: {
        title: 'Chicken',
      },
      amount: 1,
      placedBy: 9,
      status: 'PLACED',
      order: {
        _id: 'o0',
        createAt: '14:42:09',
      },
    },
    {
      _id: 1,
      menuItem: {
        title: 'Egg',
      },
      amount: 2,
      placedBy: 5,
      status: 'PLACED',
      order: {
        _id: 'o1',
        createAt: '17:08:27',
      },
    },
    {
      _id: 2,
      menuItem: {
        title: 'Coffee',
      },
      amount: 1,
      placedBy: 4,
      status: 'PLACED',
      order: {
        _id: 'o2',
        createAt: '15:05:58',
      },
    },
    {
      _id: 3,
      menuItem: {
        title: 'Egg',
      },
      amount: 4,
      placedBy: 1,
      status: 'PLACED',
      order: {
        _id: 'o3',
        createAt: '16:58:29',
      },
    },
    {
      _id: 4,
      menuItem: {
        title: 'Egg',
      },
      amount: 1,
      placedBy: 8,
      status: 'PLACED',
      order: {
        _id: 'o4',
        createAt: '16:23:47',
      },
    },
    {
      _id: 5,
      menuItem: {
        title: 'Coffee',
      },
      amount: 4,
      placedBy: 10,
      status: 'PLACED',
      order: {
        _id: 'o5',
        createAt: '16:23:08',
      },
    },
    {
      _id: 6,
      menuItem: {
        title: 'Burger',
      },
      amount: 3,
      placedBy: 7,
      status: 'PLACED',
      order: {
        _id: 'o6',
        createAt: '15:59:43',
      },
    },
    {
      _id: 7,
      menuItem: {
        title: 'Egg',
      },
      amount: 2,
      placedBy: 1,
      status: 'PLACED',
      order: {
        _id: 'o7',
        createAt: '18:46:02',
      },
    },
    {
      _id: 8,
      menuItem: {
        title: 'Chicken',
      },
      amount: 4,
      placedBy: 8,
      status: 'PLACED',
      order: {
        _id: 'o8',
        createAt: '14:29:28',
      },
    },
    {
      _id: 9,
      menuItem: {
        title: 'Coffee',
      },
      amount: 3,
      placedBy: 6,
      status: 'PLACED',
      order: {
        _id: 'o9',
        createAt: '16:05:50',
      },
    },
    {
      _id: 10,
      menuItem: {
        title: 'Chicken',
      },
      amount: 3,
      placedBy: 9,
      status: 'PLACED',
      order: {
        _id: 'o10',
        createAt: '18:15:13',
      },
    },
    {
      _id: 11,
      menuItem: {
        title: 'Lamb',
      },
      amount: 1,
      placedBy: 5,
      status: 'PLACED',
      order: {
        _id: 'o11',
        createAt: '17:16:21',
      },
    },
    {
      _id: 12,
      menuItem: {
        title: 'Apple',
      },
      amount: 3,
      placedBy: 8,
      status: 'PLACED',
      order: {
        _id: 'o12',
        createAt: '20:12:22',
      },
    },
    {
      _id: 13,
      menuItem: {
        title: 'Chicken',
      },
      amount: 2,
      placedBy: 4,
      status: 'PLACED',
      order: {
        _id: 'o13',
        createAt: '15:48:49',
      },
    },
    {
      _id: 14,
      menuItem: {
        title: 'Egg',
      },
      amount: 2,
      placedBy: 10,
      status: 'PLACED',
      order: {
        _id: 'o14',
        createAt: '14:06:26',
      },
    },
    {
      _id: 15,
      menuItem: {
        title: 'Apple',
      },
      amount: 4,
      placedBy: 5,
      status: 'PLACED',
      order: {
        _id: 'o15',
        createAt: '18:32:56',
      },
    },
    {
      _id: 16,
      menuItem: {
        title: 'Beef',
      },
      amount: 3,
      placedBy: 5,
      status: 'PLACED',
      order: {
        _id: 'o16',
        createAt: '20:26:17',
      },
    },
    {
      _id: 17,
      menuItem: {
        title: 'Beef',
      },
      amount: 4,
      placedBy: 7,
      status: 'PLACED',
      order: {
        _id: 'o17',
        createAt: '15:44:10',
      },
    },
    {
      _id: 18,
      menuItem: {
        title: 'Coke',
      },
      amount: 3,
      placedBy: 1,
      status: 'PLACED',
      order: {
        _id: 'o18',
        createAt: '15:25:55',
      },
    },
    {
      _id: 19,
      menuItem: {
        title: 'Lamb',
      },
      amount: 3,
      placedBy: 8,
      status: 'PLACED',
      order: {
        _id: 'o19',
        createAt: '20:32:18',
      },
    },
  ],
  requests: [
    {
      _id: 0,
      receiveTime: '14:50:00',
      tableId: 2,
      finishTime: null,
    },
    {
      _id: 1,
      receiveTime: '20:36:53',
      tableId: 2,
      finishTime: null,
    },
    {
      _id: 2,
      receiveTime: '20:26:45',
      tableId: 7,
      finishTime: null,
    },
    {
      _id: 3,
      receiveTime: '19:31:44',
      tableId: 10,
      finishTime: null,
    },
    {
      _id: 4,
      receiveTime: '14:45:15',
      tableId: 9,
      finishTime: null,
    },
    {
      _id: 5,
      receiveTime: '16:34:22',
      tableId: 10,
      finishTime: null,
    },
    {
      _id: 6,
      receiveTime: '16:57:12',
      tableId: 7,
      finishTime: null,
    },
    {
      _id: 7,
      receiveTime: '19:11:34',
      tableId: 6,
      finishTime: null,
    },
    {
      _id: 8,
      receiveTime: '20:28:22',
      tableId: 1,
      finishTime: null,
    },
    {
      _id: 9,
      receiveTime: '20:15:13',
      tableId: 8,
      finishTime: null,
    },
    {
      _id: 10,
      receiveTime: '14:46:05',
      tableId: 1,
      finishTime: null,
    },
    {
      _id: 11,
      receiveTime: '16:46:33',
      tableId: 5,
      finishTime: null,
    },
    {
      _id: 12,
      receiveTime: '17:38:26',
      tableId: 3,
      finishTime: null,
    },
    {
      _id: 13,
      receiveTime: '14:15:15',
      tableId: 1,
      finishTime: null,
    },
    {
      _id: 14,
      receiveTime: '18:58:35',
      tableId: 9,
      finishTime: null,
    },
    {
      _id: 15,
      receiveTime: '16:21:12',
      tableId: 2,
      finishTime: null,
    },
    {
      _id: 16,
      receiveTime: '15:10:52',
      tableId: 7,
      finishTime: null,
    },
    {
      _id: 17,
      receiveTime: '15:17:13',
      tableId: 7,
      finishTime: null,
    },
    {
      _id: 18,
      receiveTime: '15:55:46',
      tableId: 2,
      finishTime: null,
    },
    {
      _id: 19,
      receiveTime: '15:43:18',
      tableId: 5,
      finishTime: null,
    },
  ],
}

module.exports = fakeData
