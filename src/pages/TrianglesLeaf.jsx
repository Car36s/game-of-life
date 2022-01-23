import React, { useCallback, useState, useEffect } from 'react'
import Sketch from 'react-p5'
import { nestTriangles, triangleOnOffset } from '../lib/triangles'
const screenSize = 1000

const degToRad = (deg) => (deg * Math.PI) / 180

const TrianglesLeaf = () => {
    const [length, setLength] = useState(200)
    const [angle, setAngle] = useState(0)
    const [depth, setDepth] = useState(25)
    const [gridRadius, setGridRadius] = useState(1)
    const [grid, setGrid] = useState([])

    useEffect(() => {
        // const triangleSide = Math.cos(Math.PI / 6) * length * 2
        const triangleHeight = Math.sin(degToRad(30)) * length

        setGrid(() => {
            // initialize grid with first/center triangle
            const grid = [[screenSize / 2, screenSize / 2, 0]]
            for (let jj = 1; jj < gridRadius; jj++) {
                if (jj === 1) {
                    for (let layerOne = 0; layerOne < 3; layerOne++) {
                        const angle = 60 + layerOne * 120
                        const x = screenSize / 2 + 0.95 * triangleHeight * 2 * Math.cos(degToRad(angle))
                        const y = screenSize / 2 + 0.95 * triangleHeight * 2 * Math.sin(degToRad(angle))
                        grid.push([x, y, angle])
                    }
                }
                if (jj === 2) {
                    const [, ...centers] = grid
                    centers.forEach(([x, y, a]) => {
                        const angle = a - 60
                        const xOffset = x + 0.95 * triangleHeight * 2 * Math.cos(degToRad(angle))
                        const yOffset = y + 0.95 * triangleHeight * 2 * Math.sin(degToRad(angle))
                        grid.push([xOffset, yOffset, angle])

                        const angle1 = a + 60
                        const xOffset1 = x + 0.95 * triangleHeight * 2 * Math.cos(degToRad(angle1))
                        const yOffset1 = y + 0.95 * triangleHeight * 2 * Math.sin(degToRad(angle1))
                        grid.push([xOffset1, yOffset1, angle1])
                    })
                }
                if (jj > 2) {
                    const centers = grid.slice(-6)
                    centers.forEach(([x, y, a], index) => {
                        const angle = a - 60
                        const xOffset = x + 0.95 * triangleHeight * 2 * Math.cos(degToRad(angle))
                        const yOffset = y + 0.95 * triangleHeight * 2 * Math.sin(degToRad(angle))
                        grid.push([xOffset, yOffset, angle])

                        if (index % 2) {
                            const angle1 = a + 60
                            const xOffset1 = x + 0.95 * triangleHeight * 2 * Math.cos(degToRad(angle1))
                            const yOffset1 = y + 0.95 * triangleHeight * 2 * Math.sin(degToRad(angle1))
                            grid.push([xOffset1, yOffset1, angle1])
                        }
                    })
                }
            }
            return grid
        })
    }, [length, gridRadius])

    const setup = useCallback((p5, canvasParentRef) => {
        p5.createCanvas(screenSize, screenSize).parent(canvasParentRef)
    }, [])

    const draw = useCallback(
        (p5) => {
            const { mouseX, mouseY } = p5
            p5.background(0)
            p5.noFill()
            p5.ellipse(mouseX, mouseY, 20, 20)
            p5.stroke(0, 255, 0)

            grid.forEach(([xOffset, yOffset, angle]) =>
                nestTriangles(length, angle, depth).forEach((triangle) =>
                    p5.triangle(...triangleOnOffset(xOffset, yOffset, triangle))
                )
            )
        },
        [depth, grid, length]
    )
    const onSetLength = useCallback(({ target: { value } }) => setLength(~~value), [])
    const onSetAngle = useCallback(({ target: { value } }) => {
        setAngle(~~value)
    }, [])
    const onSetDepth = useCallback(({ target: { value } }) => setDepth(~~value), [])
    const onSetGridRadius = useCallback(({ target: { value } }) => {
        setGridRadius(~~value)
    }, [])

    return (
        <>
            <label htmlFor="length-slider">Size ({length})</label>

            <input
                className="slider"
                id="length-slider"
                max="600"
                min="10"
                onChange={onSetLength}
                type="range"
                value={length}
            />

            <label htmlFor="angle-slider">Angle ({angle})</label>

            <input
                className="slider"
                id="angle-slider"
                max="360"
                min="0"
                onChange={onSetAngle}
                type="range"
                value={angle}
            />

            <label htmlFor="depth-slider">Depth ({depth})</label>

            <input
                className="slider"
                id="depth-slider"
                max="50"
                min="0"
                onChange={onSetDepth}
                type="range"
                value={depth}
            />

            <label htmlFor="gridRadius-slider">Radius ({gridRadius})</label>

            <input
                className="slider"
                id="gridRadius-slider"
                max="10"
                min="0"
                onChange={onSetGridRadius}
                type="range"
                value={gridRadius}
            />

            <Sketch draw={draw} setup={setup} />
        </>
    )
}

export default TrianglesLeaf
