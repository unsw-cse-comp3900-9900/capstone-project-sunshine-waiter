import React, { Component } from 'react'

import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function ChooseTable(props) {
  let query = useQuery()
  console.log('tableid->', props.tabelid)
}
