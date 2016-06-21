const resources = Array(100)
  .fill()
  .map((_, index) => {
    return {
      id: index,
      label: `Resource ${index}`,
      type: 'resource'
    }
  })

export default resources
