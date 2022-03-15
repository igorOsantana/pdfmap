import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Rect, Transformer } from 'react-konva'

const MINIMAL_TRANSFORM_SIZE = 5

function Element ({
  elementProps,
  isSelected,
  onSelect,
  onChange
}) {
  const rectangleRef = useRef()
  const transformRef = useRef()

  const changeElement = changes => onChange({ ...elementProps, ...changes })

  const handleTransform = (oldBox, newBox) => {
    if (
      newBox.width < MINIMAL_TRANSFORM_SIZE ||
      newBox.height < MINIMAL_TRANSFORM_SIZE
    ) { return oldBox }

    return newBox
  }

  const handleDragEnd = event => {
    changeElement({
      x: event.target.x(),
      y: event.target.y(),
      width: event.target.attrs.width,
      height: event.target.attrs.height
    })
  }

  const handleTransformEnd = () => {
    const node = rectangleRef.current
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    changeElement({
      x: node.x(),
      y: node.y(),
      width: Math.max(MINIMAL_TRANSFORM_SIZE, node.width() * scaleX),
      height: Math.max(MINIMAL_TRANSFORM_SIZE, node.height() * scaleY)
    })
  }

  const handleClickElement = () => {
    onSelect()
  }

  useEffect(() => {
    if (isSelected) {
      transformRef.current.nodes([rectangleRef.current])
      transformRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <Rect
        onClick={handleClickElement}
        ref={rectangleRef}
        {...elementProps}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected
        ? <Transformer
            ref={transformRef}
            boundBoxFunc={handleTransform}
            rotateEnabled={false}
          />
        : null}
    </>
  )
}

Element.propTypes = {
  elementProps: PropTypes.shape({
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Element
