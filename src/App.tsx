
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Participants from './components/Participants'
import Results from './components/Results'
import ParticipantsPage from './components/ParticipantPage'

function App() {
  return (
    <>
      <Routes>
        <Route path='/participants' element={<Participants />}></Route>
        <Route path='/results' element={<Results />}></Route>
        <Route path='/' element={<ParticipantsPage />}></Route>
      </Routes>
    </>
  )
}

export default App
