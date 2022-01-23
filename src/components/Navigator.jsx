import React from 'react'
import { Link } from 'react-router-dom'

const Navigator = () => (
    <nav>
        <Link to="/">TrianglesLeaf</Link>
        <Link to="/grid">TrianglesGrid</Link>
        <Link to="/gameoflife">GameOfLife</Link>
    </nav>
)

export default Navigator
