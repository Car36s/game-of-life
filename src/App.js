import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navigator from './components/Navigator'
import GameOfLife from './pages/GameOfLife'
import TrianglesGrid from './pages/TrianglesGrid'
import TrianglesLeaf from './pages/TrianglesLeaf'

const App = () => (
    <>
        <Navigator />
        <Routes>
            <Route path="/" element={<TrianglesLeaf />} />
            <Route path="/grid" element={<TrianglesGrid />} />
            <Route path="/gameoflife" element={<GameOfLife />} />
        </Routes>
    </>
)

export default App
