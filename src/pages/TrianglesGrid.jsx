import React, { useCallback, useState, useEffect } from 'react'
import Sketch from 'react-p5'
import { produce } from 'immer'
import { nestTriangles, triangleOnOffset } from '../lib/triangles'
const screenSize = 1500
const gridLength = 5
const gridHeight = 10

const TrianglesGrid = () => {
    const [length, setLength] = useState(200)
    const [angle, setAngle] = useState(0)
    const [depth, setDepth] = useState(25)
    const [step, setStep] = useState(1)
    const [grid, setGrid] = useState([])

    useEffect(() => {
        const triangleSide = Math.cos(Math.PI / 6) * length * 2
        const triangleHeight = Math.sin(Math.PI / 6) * length

        setGrid((grid) =>
            produce(grid, (gridCopy) => {
                let rowCounter = 0 // rows 0-1 => 0, 2-3 => 1, etc..
                for (let jj = 0; jj < gridHeight; jj++) {
                    const yOffset = triangleHeight * (jj + 1) + 10 + rowCounter * triangleHeight

                    for (let ii = 0; ii < gridLength; ii++) {
                        const xOffset = triangleSide * ii + length + ((jj % 2) * triangleSide) / 2 - 300

                        gridCopy[gridLength * jj + ii] = [xOffset, yOffset, 90 + jj * 180 + (rowCounter % 2) * angle]
                    }

                    rowCounter += jj % 2
                }
            })
        )
    }, [length, angle])

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
    const onSetStep = useCallback(({ target: { value } }) => {
        setStep(~~value)
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
                max="30"
                min="0"
                onChange={onSetDepth}
                type="range"
                value={depth}
            />

            <label htmlFor="step-slider">Step ({step})</label>

            <input
                className="slider"
                id="step-slider"
                max="100"
                min="0"
                onChange={onSetStep}
                type="range"
                value={step}
            />

            <Sketch draw={draw} setup={setup} />
        </>
    )
}

export default TrianglesGrid
