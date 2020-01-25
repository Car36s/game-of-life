import React, { useCallback, useState, useEffect } from 'react'
import Sketch from 'react-p5'

const magicStep = [Math.PI / 36, 87 / 100]

const getTriangleCoordinates = (xOffset, yOffset, length, angle) => [
    xOffset + length * Math.cos(angle),
    yOffset + length * Math.sin(angle),
    xOffset + length * Math.cos((2 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((2 / 3) * Math.PI + angle),
    xOffset + length * Math.cos((4 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((4 / 3) * Math.PI + angle),
]

const nestTriangles = (xOffset, yOffset, length, angle, depth, step) => {
    angle = (angle * Math.PI) / 180
    const triangles = [getTriangleCoordinates(xOffset, yOffset, length, angle)]

    const [angleIncrement, lenghtIncrement] = magicStep

    const doNesting = (_length, _angle, nextDepth) => {
        if (nextDepth < 0) return triangles

        triangles.push(getTriangleCoordinates(xOffset, yOffset, _length, _angle))

        doNesting(_length * lenghtIncrement, _angle + angleIncrement, nextDepth - 1)
    }

    doNesting(length * lenghtIncrement, angle + angleIncrement, depth - 1)

    return triangles
}

const Triangles = () => {
    const [length, setLength] = useState(300)
    const [angle, setAngle] = useState(30)
    const [depth, setDepth] = useState(25)
    const [step, setStep] = useState(magicStep)

    const [triangles, setTriangles] = useState(nestTriangles(400, 400, length, angle, depth, step))

    useEffect(() => {
        setTriangles(nestTriangles(400, 400, length, angle, depth, step))
    }, [length, angle, depth, step])

    const setup = useCallback((p5, canvasParentRef) => {
        p5.createCanvas(1000, 1000).parent(canvasParentRef)
    }, [])

    const draw = useCallback(
        p5 => {
            const { mouseX, mouseY } = p5
            p5.background(0)
            p5.noFill()
            p5.ellipse(mouseX, mouseY, 20, 20)
            p5.stroke(0, 255, 0)
            triangles.map(triangle => p5.triangle(...triangle))
        },
        [triangles]
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

            <label htmlFor="length-slider">Size</label>
            <input
                className="slider"
                id="length-slider"
                max="600"
                min="10"
                onChange={onSetLength}
                type="range"
                value={length}
            />

            <label htmlFor="angle-slider">Angle</label>
            <input
                className="slider"
                id="angle-slider"
                max="360"
                min="0"
                onChange={onSetAngle}
                type="range"
                value={angle}
            />

            <label htmlFor="depth-slider">Depth</label>
            <input
                className="slider"
                id="depth-slider"
                max="30"
                min="0"
                onChange={onSetDepth}
                type="range"
                value={depth}
            />

            <label htmlFor="step-slider">Step</label>
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
