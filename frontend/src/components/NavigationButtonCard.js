import React from 'react'
import { Link } from 'react-router-dom'

const NavigationButtonCard = props => {
  return (
    <Link
      role="button"
      to={props.linkTo}
      name={props.linkName}
      onClick={props.linkOnClick}
      className="btn btn-primary mx-2"
    >
      <span>{props.children}</span>
      {props.linkName}
    </Link>
  )
}

export default NavigationButtonCard
