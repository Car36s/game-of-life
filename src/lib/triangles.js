const getTriangle = (length, angle) => [
    length * Math.cos(angle),
    length * Math.sin(angle),
    length * Math.cos((2 / 3) * Math.PI + angle),
    length * Math.sin((2 / 3) * Math.PI + angle),
    length * Math.cos((4 / 3) * Math.PI + angle),
    length * Math.sin((4 / 3) * Math.PI + angle),
]

export const magicStep = [Math.PI / 57, 91 / 100]

export const nestTriangles = (length, angle, depth) => {
    angle = (angle * Math.PI) / 180
    const triangles = []
    // const triangles = [getTriangle(length, angle)]

    const [angleIncrement, lenghtIncrement] = magicStep

    const doNesting = (_length, _angle, nextDepth) => {
        if (nextDepth < 0) return triangles

        triangles.push(getTriangle(_length, _angle))

        return doNesting(_length * lenghtIncrement, _angle + angleIncrement, nextDepth - 1)
    }

    return doNesting(length * lenghtIncrement, angle + angleIncrement, depth - 1)
}

export const triangleOnOffset = (xOffset, yOffset, [x1, y1, x2, y2, x3, y3]) => [
    x1 + xOffset,
    y1 + yOffset,
    x2 + xOffset,
    y2 + yOffset,
    x3 + xOffset,
    y3 + yOffset,
]
