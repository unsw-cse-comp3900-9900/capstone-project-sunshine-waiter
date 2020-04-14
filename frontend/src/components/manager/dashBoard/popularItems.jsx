import React from 'react'
import { Tooltip } from 'antd'
import {
  VictoryChart,
  VictoryBar,
  VictoryContainer,
  VictoryLabel,
  VictoryAxis,
} from 'victory'
import { groupBy } from '../../Waiter/Dishes'

const PopularItems = ({ data }) => {
  const groupByItem = groupBy(data, 'name')
  let barData = []
  for (let [name, group] of groupByItem) {
    let amount = group.length
    barData.push({ x: name, y: amount })
  }
  barData = barData.sort((a, b) => a.y - b.y).slice(0, 4)

  return (
    <React.Fragment>
      <span>Best Selling Dishes</span>
      <VictoryChart
        containerComponent={<VictoryContainer />}
        domainPadding={30}
      >
        <VictoryAxis
          style={{
            axis: { size: 0 },
            axisLabel: { fontSize: 20, padding: 30 },
          }}
        />
        <VictoryBar
          data={barData}
          labels={({ datum }) => datum.y}
          barRatio={1}
          x={datum =>
            datum.x.length < 12 ? datum.x : datum.x.slice(0, 12) + '...'
          }
          cornerRadius={{ top: 10 }}
          style={{ data: { fill: '#2393d3ce' } }}
        />
      </VictoryChart>
    </React.Fragment>
  )
}

export default PopularItems
