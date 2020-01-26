import React, { useCallback, useState, useEffect } from 'react'
import Sketch from 'react-p5'
import { nestTriangles, triangleOnOffset } from '../lib/triangles'
const screenSize = 1000

const Triangles = () => {
    const [length, setLength] = useState(300)
    const [angle, setAngle] = useState(30)
    const [depth, setDepth] = useState(25)
    const [step, setStep] = useState(1)
    const [grid, setGrid] = useState([[500, 500]])

    const [triangles, setTriangles] = useState(nestTriangles(length, angle, depth))

    useEffect(() => setTriangles(nestTriangles(length, angle, depth)), [length, angle, depth])
    /*
    useEffect(() => {
        for (let jj = 0; jj <= screenSize; jj + length) {
            for (let ii = 0; ii <= screenSize; ii + length) {
                const x = (length * ii) / 2
                const y = jj % 2 ? 
            }
        }
    }, [])
*/
    const setup = useCallback((p5, canvasParentRef) => {
        p5.createCanvas(screenSize, screenSize).parent(canvasParentRef)
    }, [])

    const draw = useCallback(
        p5 => {
            const { mouseX, mouseY } = p5
            p5.background(0)
            p5.noFill()
            p5.ellipse(mouseX, mouseY, 20, 20)
            p5.stroke(0, 255, 0)
            grid.forEach(offset => triangles.forEach(triangle => p5.triangle(...triangleOnOffset(offset, triangle))))
        },
        [grid, triangles]
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
            <Sketch draw={draw} setup={setup} />

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
        </>
    )
}

export default Triangles
