import React from 'react'
import {
  VictoryChart,
  VictoryBrushContainer,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from 'victory'

const TimeIntervalMessage = ({ start, end }) => {
  if (start)
    return (
      <span>
        From {start.toLocaleDateString()} to {end.toLocaleDateString()}
      </span>
    )
  return <h4>Drag the brush below to select time interval</h4>
}

const TimeSelector = ({ data, brushDomain, handleBrush }) => {
  const [start, end] = brushDomain.x || [null, null]
  return (
    <React.Fragment>
      <TimeIntervalMessage start={start} end={end} />
      <VictoryChart
        padding={{ top: 10, bottom: 30 }}
        width={1000}
        height={90}
        scale={{ x: 'time' }}
        // animate={{
        //   duration: 1000,
        //   onLoad: { duration: 1000 },
        // }}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushDomain={brushDomain}
            onBrushDomainChange={handleBrush}
          />
        }
      >
        <VictoryAxis />
        <VictoryLine
          data={data}
          interpolation="basis"
          style={{ data: { stroke: '#2393d3ce' } }}
        />
      </VictoryChart>
    </React.Fragment>
  )
}

export default TimeSelector
