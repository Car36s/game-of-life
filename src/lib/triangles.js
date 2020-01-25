const getTriangle = (xOffset, yOffset, length, angle) => [
    xOffset + length * Math.cos(angle),
    yOffset + length * Math.sin(angle),
    xOffset + length * Math.cos((2 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((2 / 3) * Math.PI + angle),
    xOffset + length * Math.cos((4 / 3) * Math.PI + angle),
    yOffset + length * Math.sin((4 / 3) * Math.PI + angle),
]

export const magicStep = [Math.PI / 36, 87 / 100]

export const nestTriangles = (xOffset, yOffset, length, angle, depth) => {
    angle = (angle * Math.PI) / 180
    const triangles = [getTriangle(xOffset, yOffset, length, angle)]

    const [angleIncrement, lenghtIncrement] = magicStep

    const doNesting = (_length, _angle, nextDepth) => {
        if (nextDepth < 0) return triangles

        triangles.push(getTriangle(xOffset, yOffset, _length, _angle))

        return doNesting(_length * lenghtIncrement, _angle + angleIncrement, nextDepth - 1)
    }

    return doNesting(length * lenghtIncrement, angle + angleIncrement, depth - 1)
}
