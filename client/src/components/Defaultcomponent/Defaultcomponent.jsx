import React from 'react'
//import Headercomponent from '../Headercomponent/Headercomponent'
import AppWithRouter from '../Headercomponent/Headercomponent'

const Defaultcomponent = ({children}) => {
  return (
    <div>
      <AppWithRouter/>
      {children}
    </div>
  )
}

export default Defaultcomponent
