import React, { useCallback, useState, useEffect } from 'react'
import Sketch from 'react-p5'
const getTriangleCoordinates = (xOffset, yOffset, length, angle) => [
    xOffset + length * Math.cos(angle),
    yOffset + length * Math.sin(angle),
    xOffset + length * Math.cos((2 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((2 / 3) * Math.PI + angle),
    xOffset + length * Math.cos((4 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((4 / 3) * Math.PI + angle),
]

const nestTriangles = (xOffset, yOffset, length, angle, depth) => {
    const triangles = [getTriangleCoordinates(xOffset, yOffset, length, angle)]

    const angleIncrement = Math.PI / 36
    const lenghtIncrement = 0.87

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

    const [triangles, setTriangles] = useState(nestTriangles(400, 400, length, angle, depth))

    useEffect(() => {
        setTriangles(nestTriangles(400, 400, length, angle, depth))
    }, [length, angle, depth])

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
    return (
        <>
            <Sketch draw={draw} setup={setup} />
            <input
                className="slider"
                id="lenght"
                max="600"
                min="10"
                onChange={onSetLength}
                type="range"
                value={length}
            />
            <input className="slider" id="angle" max="360" min="0" onChange={onSetAngle} type="range" value={angle} />
            <input className="slider" id="depth" max="50" min="0" onChange={onSetDepth} type="range" value={depth} />
        </>
    )
}

export default Triangles
