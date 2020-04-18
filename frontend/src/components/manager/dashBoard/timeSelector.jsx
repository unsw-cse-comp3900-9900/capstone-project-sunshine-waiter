import React from 'react'
import {
  VictoryChart,
  VictoryBrushContainer,
  VictoryLine,
  VictoryAxis,
  VictoryBar,
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
  if (!data.length) return <span className="badge badge-warning">No Data</span>
  const [start, end] = zoomDomain.x || [null, null]
  return (
    <React.Fragment>
      <TimeIntervalMessage start={start} end={end} />
      <VictoryChart
        padding={{ top: 10, bottom: 30 }}
        domainPadding={20}
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
        <VictoryBar data={data} style={{ data: { fill: '#2393d3' } }} />
      </VictoryChart>
    </React.Fragment>
  )
}

export default TimeSelector
