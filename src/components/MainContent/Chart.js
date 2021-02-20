import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  select,
  area,
  curveCardinal,
  axisBottom,
  scaleLinear,
  scaleBand,
} from 'd3'

import { OpacityAnimation } from '../StyledComponents/OpacityAnimation'

const Chart = (props) => {
  const svgRef = useRef()
  const areaData = useSelector((state) => state.data.areaData)
  const dataTitle = useSelector((state) => state.data.dataTitle)
  const filteredAreaData = areaData.filter((item) => item.name === dataTitle)
  const slice = useSelector((state) => state.data.slice)
  const [windowWidth, setWindowWith] = useState(window.innerWidth)

  useEffect(() => {
    // let chartWidth =
    let data = []
    let labels = []
    if (filteredAreaData.length > 0) {
      data = filteredAreaData[0].data.map((dt) => dt.score).slice(slice)
      labels = filteredAreaData[0].data.map((dt) => dt.date).slice(slice)
    }

    const svg = select(svgRef.current)

    const xScale = scaleLinear()
      .domain([0, labels.length - 1])
      .range([8.5, (windowWidth * 83) / 100])

    const xScaleAxis = scaleBand()
      .domain(labels)
      .paddingInner(1)
      .range([7, (windowWidth * 83) / 100])

    const yScale = scaleLinear().domain([0, 110]).range([250, 0])

    const xAxis = axisBottom(xScaleAxis)
    svg.select('.x-axis').style('transform', 'translateY(260px)').call(xAxis)

    const myArea = area()
      .x((value, index) => xScale(index))
      .y0(250)
      .y1((value) => yScale(value))
      .curve(curveCardinal)

    svg
      .selectAll('.area')
      .data([data])
      .join('path')
      .attr('class', 'area')
      .attr('d', (value) => myArea(value))
      .attr('fill', '#0071C5')
      .attr('stroke', '#0071C5')

    svg
      .selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('stroke', '#fff')
      .attr('stroke-width', windowWidth / 530 > 3 ? 3 : windowWidth / 530)
      .attr('r', windowWidth / 180 > 8 ? 8 : windowWidth / 150)
      .attr('fill', '#0071C5')
      .attr('cx', (value, index) => xScale(index))
      .attr('cy', yScale)

    svg
      .selectAll('.text')
      .data(data)
      .join('text')
      .attr('class', 'text')
      .attr('font-weight', '300')
      .attr('font-size', '12')
      .attr('transform', 'translate(-9,-15)')
      .attr('x', (value, index) => xScale(index))
      .attr('y', yScale)
      .text((value) => `${value}%`)

    const handleResize = () => {
      setWindowWith(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slice, filteredAreaData, windowWidth])

  return (
    <ChartContainer key={slice}>
      <Svg ref={svgRef}>
        <g className='x-axis' />
      </Svg>
    </ChartContainer>
  )
}

export default Chart

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  height: 32rem;
  animation: ${OpacityAnimation} 2s;
`
const Svg = styled.svg`
  height: 100%;
  width: 100%;
  overflow: 'visible';
`
