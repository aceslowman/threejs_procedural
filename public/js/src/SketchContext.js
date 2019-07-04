import React from 'react'

const SketchContext = React.createContext({})

export const SketchProvider = SketchContext.Provider
export const SketchConsumer = SketchContext.Consumer
export default SketchContext