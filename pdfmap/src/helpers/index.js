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
