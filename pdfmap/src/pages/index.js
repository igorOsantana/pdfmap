import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import 'antd/dist/antd.css'

import SideMenu from '../components/sideMenu'
import { useDocument } from '../hooks'
import { LOCAL_STORAGE_KEY_TO_MAP } from '../constants'

const DocumentContainer = dynamic(
  () => import('../components/documentContainer'),
  { ssr: false }
)
const MapContainer = dynamic(() => import('../components/mapContainer'), {
  ssr: false
})

const STYLE_MAIN = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative'
}

export default function Home () {
  const [elements, setElements] = useState([])
  const [mapContainerConfig, setMapContainerConfig] = useState({
    width: 0,
    height: 550
  })

  const { scale } = useDocument()

  const handleAddElement = element => {
    const newElement = { ...element, x: 0, y: 0, id: uuidv4() }
    const allElements = [...elements, newElement]

    localStorage.setItem(LOCAL_STORAGE_KEY_TO_MAP, JSON.stringify(allElements))
    getElementsFromStorage()
  }

  const resizeElementsByScale = () => {
    setElements(prevState => prevState.map(({ x, y, width, height, ...restElement }) => ({
      ...restElement,
      x: x * scale,
      y: y * scale,
      width: width * scale,
      height: height * scale
    })))
  }

  const getElementsFromStorage = () => {
    const items = localStorage.getItem(LOCAL_STORAGE_KEY_TO_MAP)
    if (items) setElements(JSON.parse(items))
  }

  useEffect(() => {
    getElementsFromStorage()
  }, [])

  useEffect(() => {
    resizeElementsByScale()
  }, [scale])

  return (
      <main style={STYLE_MAIN}>
        <SideMenu
          onAddElement={handleAddElement}
          elements={elements}
          setElements={setElements}
        />
        <DocumentContainer setDocumentSize={setMapContainerConfig} />
        <MapContainer
          config={mapContainerConfig}
          elements={elements}
          setElements={setElements}
        />
      </main>
  )
}
