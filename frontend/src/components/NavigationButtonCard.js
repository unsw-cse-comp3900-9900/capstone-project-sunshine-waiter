import React from 'react'
import { Link } from 'react-router-dom'

const NavigationButtonCard = props => {
  return (
    <button className="ui basic button">
      <Link
        to={props.linkTo}
        name={props.linkName}
        onClick={props.linkOnClick}
        className={
          props.linkActiveItem === props.linkName ? 'active item' : 'item'
        }
      >
        <span>{props.children}</span>
        {props.linkName}
      </Link>
    </button>
  )
}

export default NavigationButtonCard
