import { useState } from 'react'
import './App.css'
import PdfViewer from './components/PdfViewer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <PdfViewer/>
      
      </div>
    
    </>
  )
}

export default App
