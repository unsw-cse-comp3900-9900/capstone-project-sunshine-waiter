import React from 'react'

import NavigationButtonCard from './NavigationButtonCard'

export default class Navigation extends React.Component {
  state = {
    activeItem: '',
  }

  handleItemClick = e => {
    this.setState({ activeItem: e.target.name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <NavigationButtonCard
          linkActiveItem={activeItem}
          linkTo="/waiter"
          linkName="Waiter"
          linkOnClick={this.handleItemClick}
        >
          <i className="user icon"></i>
        </NavigationButtonCard>
        <NavigationButtonCard
          linkActiveItem={activeItem}
          linkTo="/cook"
          linkName="Cook"
          linkOnClick={this.handleItemClick}
        >
          <i className="food icon"></i>
        </NavigationButtonCard>
        <NavigationButtonCard
          linkActiveItem={activeItem}
          linkTo="/manager"
          linkName="Manager"
          linkOnClick={this.handleItemClick}
        >
          <i className="spy icon"></i>
        </NavigationButtonCard>
      </div>
    )
  }
}
