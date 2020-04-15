import React from 'react'
import { Link } from 'react-router-dom'
import { compareTwoArrays } from '../../services'
import { getCookie } from '../../authenticate/Cookies'
import { Polling } from '../../apis/Polling'
import { getRestaurants } from '../../apis/actions/restaurants'

class OwnedRestaurants extends React.Component {
  //I think reason is when using a tag, it freshes when hitting the page url, so state got freshed back to init
  //prolem is I used a tag in Myprofile
  state = {
    restaurants: [],
  }

  updateRestaurants = (restaurants = []) => {
    if (
      !compareTwoArrays(restaurants, this.state.restaurants) ||
      !compareTwoArrays(this.state.restaurants, restaurants)
    ) {
      this.setState({
        restaurants: restaurants,
      })
    }
  }

  componentDidMount = () => {
    Polling(
      () => getRestaurants(getCookie('token'), this.updateRestaurants),
      1000
    )
  }

  renderOwnedRestaurantsList = () => {
    const { restaurants } = this.state
    const { showModal, onDeleteRestaurant, onSetEditingRestaurant } = this.props

    //DO NOT USE <A> TAG, IT WILL RELOAD THE PAGE AND MAKE THE STATE BACK INITIAL STATE IN App.js
    if (restaurants && restaurants.length > 0) {
      return restaurants.map(({ _id, name, description }) => (
        <li className="list" key={_id}>
          {name}
          <span onClick={() => onDeleteRestaurant(_id)}>
            <i className="trash alternate outline icon right clickable" />
          </span>
          <span
            onClick={() => {
              showModal()
              onSetEditingRestaurant({ _id, name, description })
            }}
          >
            <i className="pencil alternate right clickable icon" />
          </span>
          <Link to={'/restaurants/' + _id} name={name}>
            <i className="caret square right icon" />
          </Link>
        </li>
      ))
    }
    return null
  }

  render() {
    const { showModal, onSetEditingRestaurant } = this.props
    return (
      <div className="my-restaurant">
        <h4>
          <i className="coffee small icon" />
          Owned Restaurants
          <span
            onClick={() => {
              onSetEditingRestaurant(null)
              showModal()
            }}
          >
            <i className="plus circle icon right" />
          </span>
        </h4>
        {this.renderOwnedRestaurantsList()}
      </div>
    )
  }
}

export default OwnedRestaurants
