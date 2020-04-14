import React from 'react'

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const TotalSale = ({ data, zoomDomain }) => {
  const [start, end] = zoomDomain.x || [null, null]
  let selected = []
  let totalSale = 0
  if (data.length) {
    selected = data.filter(sale => start <= sale.x && sale.x <= end)
    totalSale = selected.map(_ => _.y).reduce((a, b) => a + b, 0)
  }
  return (
    <React.Fragment>
      <span>Total Sales</span>
      <h1>${numberWithCommas(totalSale.toFixed(2))}</h1>
    </React.Fragment>
  )
}

export default TotalSale
