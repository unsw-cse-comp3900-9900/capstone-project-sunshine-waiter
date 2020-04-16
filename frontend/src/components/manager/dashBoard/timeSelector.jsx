import React from 'react'
import {
  VictoryChart,
  VictoryBrushContainer,
  VictoryLine,
  VictoryAxis,
} from 'victory'

const TimeIntervalMessage = ({ start, end }) => {
  if (start)
    return (
      <span>
        From{' '}
        <span className="badge badge-pill badge-primary">
          {start.toLocaleDateString()}
        </span>{' '}
        to{' '}
        <span className="badge badge-pill badge-primary">
          {end.toLocaleDateString()}
        </span>
      </span>
    )
  return <h4>Drag the brush below to select time interval</h4>
}

const TimeSelector = ({ data, zoomDomain, handleZoom }) => {
  const [start, end] = zoomDomain.x || [null, null]
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
            brushDomain={zoomDomain}
            onBrushDomainChange={handleZoom}
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
