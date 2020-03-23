import React from 'react'

import NavigationButtonCard from '../../NavigationButtonCard'

class MyProfile extends React.Component {
  render() {
    const { onCloseProfile } = this.props
    return (
      <div>
        <div>basic info</div>
        <div>
          <div>
            my Restaurant
            <NavigationButtonCard
              linkActiveItem="active item"
              linkTo="/restaurants/1"
              linkName="Restaurant 1"
              linkOnClick={this.handleItemClick}
            ></NavigationButtonCard>
          </div>
        </div>
        <div onClick={() => onCloseProfile(false)}>close profile</div>
      </div>
    )
  }
}

export default MyProfile
