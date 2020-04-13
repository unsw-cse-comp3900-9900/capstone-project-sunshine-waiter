import React from 'react'
import { VictoryChart, VictoryZoomContainer, VictoryLine } from 'victory'

const SalesChart = ({ data, zoomDomain, handleZoom }) => {
  return (
    <VictoryChart
      width={600}
      height={350}
      scale={{ x: 'time' }}
      containerComponent={
        <VictoryZoomContainer
          responsive={false}
          zoomDimension="x"
          zoomDomain={zoomDomain}
          onZoomDomainChange={handleZoom}
        />
      }
    >
      <VictoryLine
        style={{
          data: { stroke: 'tomato' },
        }}
        data={data}
      />
    </VictoryChart>
  )
}

export default SalesChart
