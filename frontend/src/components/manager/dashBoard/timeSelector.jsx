import React from 'react'
import {
  VictoryChart,
  VictoryBrushContainer,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from 'victory'

const TimeSelector = ({ data, brushDomain, handleBrush }) => {
  return (
    <VictoryChart
      padding={{ top: 10, left: 50, right: 50, bottom: 30 }}
      width={1000}
      height={90}
      theme={VictoryTheme.material}
      scale={{ x: 'time' }}
      containerComponent={
        <VictoryBrushContainer
          responsive={false}
          brushDimension="x"
          brushDomain={brushDomain}
          onBrushDomainChange={handleBrush}
        />
      }
    >
      <VictoryAxis tickCount={12} />
      <VictoryLine
        style={{
          data: { stroke: 'tomato' },
        }}
        data={data}
      />
    </VictoryChart>
  )
}

export default TimeSelector
