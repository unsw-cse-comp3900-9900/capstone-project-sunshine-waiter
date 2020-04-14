import React from 'react'
import { VictoryPie } from 'victory'

const CategoryPie = ({ data, categories }) => {
  let groupByCategory = {}
  let pieData = []
  if (data.length && Object.keys(categories).length) {
    let s = 0
    for (let item of data) {
      for (let cat of item.categoryArray) {
        s++
        if (cat in groupByCategory) {
          groupByCategory[cat]++
        } else {
          groupByCategory[cat] = 1
        }
      }
    }
    for (let [key, val] of Object.entries(groupByCategory)) {
      pieData.push({ x: categories[key], y: val / s })
    }
  } else {
    return (
      <React.Fragment>
        <span>Categories</span>
        <br />
        <span className="badge badge-warning">No Data</span>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <span>Categories</span>
      <VictoryPie
        name="pie"
        data={pieData}
        // labelRadius={({ innerRadius }) => innerRadius + 5}
        colorScale={[
          '#3a74b2',
          '#409dae',
          '#52c7ba',
          '#61e5c6',
          '#61f4ae',
          '#54fa87',
          '#39fd5a',
        ]}
        radius={({ datum }) => 30 + datum.y * 400}
        padAngle={({ datum }) => datum.y * 20}
        labelRadius={({ datum }) => 50 + datum.y * 400}
        innerRadius={30}
        animate={{
          duration: 1000,
        }}
        style={{ labels: { fillOpacity: 0, fontSize: 0 } }}
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
                          stroke: '#39fd5a',
                          strokeWidth: 5,
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
    </React.Fragment>
  )
}

export default CategoryPie
