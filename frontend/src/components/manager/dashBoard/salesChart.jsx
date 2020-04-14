import React from 'react'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
} from 'victory'

const SalesChart = ({ data, zoomDomain, handleZoom }) => {
  if (!data.length)
    return (
      <React.Fragment>
        <span>Sales Trend</span>
        <br />
        <span className="badge badge-warning">No Data</span>
      </React.Fragment>
    )
  return (
    <React.Fragment>
      <span>Sales Trend</span>
      <VictoryChart
        theme={VictoryTheme.material}
        width={900}
        // height={350}
        scale={{ x: 'time' }}
        // animate={{
        //   duration: 1000,
        //   onLoad: { duration: 800 },
        // }}

        containerComponent={
          <VictoryZoomContainer
            // responsive={false}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis
          style={{
            axis: { stroke: '#756f6a' },
            axisLabel: { fontSize: 20, padding: 30 },
            grid: { stroke: 'grey' },
          }}
        />
        <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
        <VictoryLine
          data={data}
          interpolation="basis"
          style={{
            data: { stroke: '#2393d3ce' },
          }}
        />
      </VictoryChart>
    </React.Fragment>
  )
}

export default SalesChart
