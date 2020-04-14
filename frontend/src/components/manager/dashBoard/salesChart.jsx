import React from 'react'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
} from 'victory'

const SalesChart = ({ data, zoomDomain, handleZoom }) => {
  return (
    <VictoryChart
      // width={600}
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
      <VictoryAxis />
      <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
      <VictoryLine
        data={data}
        interpolation="basis"
        style={{ data: { stroke: '#2393d3ce' } }}
      />
    </VictoryChart>
  )
}

export default SalesChart
