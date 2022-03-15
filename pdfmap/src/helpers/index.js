import { LOCAL_STORAGE_KEY_TO_MAP, LOCAL_STORAGE_KEY_TO_SAVE } from '../constants'

export const removeScale = (array, scale) => {
  return array.map(item => {
    const { x, y, width, height } = item
    return {
      ...item,
      x: x / scale,
      y: y / scale,
      width: width / scale,
      height: height / scale
    }
  })
}

export const getMappingElements = () => {
  const items = localStorage.getItem(LOCAL_STORAGE_KEY_TO_MAP)
  if (items) return JSON.parse(items)
  return []
}

export const saveMappingElements = (elements, scale) => {
  const items = JSON.stringify(removeScale(elements, scale))
  localStorage.setItem(LOCAL_STORAGE_KEY_TO_MAP, items)
}

export const saveElementsMapped = (elements, scale) => {
  const items = JSON.stringify(removeScale(elements, scale))
  localStorage.setItem(LOCAL_STORAGE_KEY_TO_SAVE, items)
}
