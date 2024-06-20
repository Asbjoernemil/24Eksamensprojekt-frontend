
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Participants from './components/Participants'

function App() {
  return (
    <>
      <Routes>
        <Route path='/participants' element={<Participants />}></Route>
      </Routes>
    </>
  )
}

export default App
