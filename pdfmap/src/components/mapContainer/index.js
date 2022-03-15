import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Stage, Layer } from 'react-konva'

import Element from '../element'
import UpdateElementModal from '../updateElementModal'

import { useDocument } from '../../hooks'
import { removeScale } from '../../helpers'
import { LOCAL_STORAGE_KEY_TO_MAP } from '../../constants'

const CONTAINER_STYLE = {
  position: 'absolute',
  top: 0,
  border: '1px solid #f00'
}

function MapContainer ({ config, elements, setElements }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [infoElement, setInfoElement] = useState(null)

  const { scale } = useDocument()

  const checkDeselect = event => {
    const clickedOnEmpty = event.target === event.target.getStage()
    if (clickedOnEmpty) setSelectedItem(null)
  }

  const openUpdateModal = event => {
    checkDeselect(event)
    if (event.target.parent) {
      const { target: { attrs: { id } } } = event
      const element = getElementSelected(id)
      setInfoElement(element)
      setModalVisible(true)
    }
  }

  const getElementSelected = (id) => elements.find(element => element.id === id)

  const handleCloseModal = () => setModalVisible(false)

  const handleChangeElement = ({ changes, index }) => {
    const elementsCopy = elements.slice()
    elementsCopy[index] = changes
    setElements(elementsCopy)
    saveMapChanges(elementsCopy)
  }

  const saveMapChanges = (items) => {
    const changes = JSON.stringify(removeScale(items, scale))
    localStorage.setItem(LOCAL_STORAGE_KEY_TO_MAP, changes)
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
              isSelected={id === selectedItem}
              onSelect={() => setSelectedItem(id)}
              onChange={changes => handleChangeElement({ changes, index })}
            />
          ))}
        </Layer>
      </Stage>
      {modalVisible
        ? <UpdateElementModal
            visible={modalVisible}
            info={infoElement}
            elements={elements}
            setElements={setElements}
            onClose={handleCloseModal}
            setSelectedItem={setSelectedItem}
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
