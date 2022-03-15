import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Stage, Layer } from 'react-konva'

import Element from '../element'
import UpdateElementModal from '../updateElementModal'

import { useDocument } from '../../hooks'
import { saveMappingElements } from '../../helpers'

const CONTAINER_STYLE = {
  position: 'absolute',
  top: 0,
  border: '1px solid #f00'
}

function MapContainer ({ config, elements, setElements }) {
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)

  const { scale } = useDocument()

  const checkDeselect = event => {
    const clickedOnEmpty = event.target === event.target.getStage()
    if (clickedOnEmpty) setSelectedItemId(null)
  }

  const openUpdateModal = event => {
    checkDeselect(event)
    if (event.target.parent) {
      const { target: { attrs: { id } } } = event
      const element = getElementSelected(id)
      setSelectedElement(element)
      setModalVisible(true)
    }
  }

  const getElementSelected = (id) => elements.find(element => element.id === id)

  const handleCloseModal = () => setModalVisible(false)

  const handleChangeElement = ({ changes, index }) => {
    const elementsCopy = elements.slice()
    elementsCopy[index] = changes
    setElements(elementsCopy)
    saveMappingElements(elementsCopy, scale)
  }

  return (
    <>
      <Stage
        width={config.width}
        height={config.height}
        onClick={checkDeselect}
        onDblClick={openUpdateModal}
        style={CONTAINER_STYLE}
      >
        <Layer>
          {elements.map(({ id, ...elementProps }, index) => (
            <Element
              key={id}
              elementProps={{ ...elementProps, id }}
              isSelected={id === selectedItemId}
              onSelect={() => setSelectedItemId(id)}
              onChange={changes => handleChangeElement({ changes, index })}
            />
          ))}
        </Layer>
      </Stage>
      {modalVisible
        ? <UpdateElementModal
            visible={modalVisible}
            selectedElement={selectedElement}
            elements={elements}
            setElements={setElements}
            onClose={handleCloseModal}
            setSelectedItemId={setSelectedItemId}
          />
        : null}
    </>
  )
}

MapContainer.propTypes = {
  config: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    })
  ).isRequired,
  setElements: PropTypes.func.isRequired,
  scale: PropTypes.number
}

export default MapContainer
