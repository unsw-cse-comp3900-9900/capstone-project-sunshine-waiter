import React from 'react'
import {
  VictoryChart,
  VictoryBar,
  VictoryContainer,
  VictoryAxis,
} from 'victory'
import { groupBy } from '../../Waiter/Dishes'

const PopularItems = ({ data }) => {
  if (!data.length)
    return (
      <React.Fragment>
        <span>Sales Trend</span>
        <br />
        <span className="badge badge-warning">No Data</span>
      </React.Fragment>
    )
  if (data.length < 4) {
    return (
      <React.Fragment>
        <span>Sales Trend</span>
        <br />
        <span className="badge badge-warning">Too Little Data</span>
      </React.Fragment>
    )
  }
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
        animate={{ duration: 1000 }}
      >
        <VictoryAxis
          style={{
            axis: { size: 0 },
            axisLabel: { fontSize: 20, padding: 30 },
          }}
        />
        <VictoryBar
          data={barData}
          labels={({ datum }) => `${datum.x}\n${datum.y} sold`}
          barRatio={1}
          x={datum =>
            datum.x.length < 12 ? datum.x : datum.x.slice(0, 12) + '...'
          }
          cornerRadius={{ top: 10 }}
          style={{
            data: { fill: '#2393d3ce' },
            labels: { fillOpacity: 0, fontSize: 0 },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        return {
                          style: Object.assign({}, props.style, {
                            fill: '#83e6fff6',
                          }),
                        }
                      },
                    },
                    {
                      target: 'labels',
                      mutation: props => {
                        return {
                          style: Object.assign({}, props.style, {
                            fillOpacity: 1,
                            fontSize: 16,
                          }),
                        }
                      },
                    },
                  ]
                },
                onMouseOut: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => null,
                    },
                    {
                      target: 'labels',
                      mutation: () => null,
                    },
                  ]
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </React.Fragment>
  )
}

export default PopularItems
