import React from 'react'
import { Link } from 'react-router-dom'

const NavigationButtonCard = props => {
  let className = 'btn btn-primary m-2 '
  className += props.linkActiveItem === props.linkName ? 'active item' : 'item'

  return (
    <Link
      role="button"
      to={props.linkTo}
      name={props.linkName}
      onClick={props.linkOnClick}
      className={className}
    >
      <span>{props.children}</span>
      {props.linkName}
    </Link>
  )
}

export default NavigationButtonCard
