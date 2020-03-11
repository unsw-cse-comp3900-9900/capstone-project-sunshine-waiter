//import React from 'react'

// const Customer = () => (
//   <div>
//     <h2>Here is the Customer page.</h2>
//   </div>
// )

// export default Customer

import React, { Component } from 'react'
import { getMenus } from '../services/fakemenu'

class Customer extends Component {
  state = {
    menus: getMenus(),
  }

  render() {
    return (
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>cost</th>
          </tr>
        </thead>
        <tbody>
          {this.state.menus.map(menu => (
            <tr>
              <td>{menu.title}</td>
              <td>{menu.category.name}</td>
              <td>{menu.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

export default Customer
