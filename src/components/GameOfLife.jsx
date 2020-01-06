import React, { useState, useCallback, useRef, Fragment } from 'react'
import { produce } from 'immer'

const GRID_WIDTH = 50
const GRID_HEIGHT = 50

const gridNeighbourOperations = [
    [0, 1],
    [0, -1],
    [1, 1],
    [1, 0],
    [1, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
]

const generateGrid = (randomizer = 0) => {
    const grid = []
    for (let ii = 0; ii < GRID_HEIGHT; ii++) {
        grid[ii] = Array.from(Array(GRID_WIDTH), () =>
            !!randomizer && Math.random() > randomizer ? 1 : 0
        )
    }
    return grid
}

const GameOfLife = () => {
    const [running, setRunning] = useState(false)
    const [randomizer, setRandomizer] = useState(0.5)
    const [grid, setGrid] = useState(() => generateGrid())

    const runningRef = useRef(null)

    const runSimulation = useCallback(() => {
        if (!runningRef.current) return

        setGrid(g => {
            return produce(g, gridCopy => {
                for (let ii = 0; ii < GRID_WIDTH; ii++) {
                    for (let jj = 0; jj < GRID_HEIGHT; jj++) {
                        let neighbours = 0
                        gridNeighbourOperations.map(([deltaX, deltaY]) => {
                            const neighbourX = ii + deltaX
                            const neighbourY = jj + deltaY

                            if (
                                neighbourX < 0 ||
                                neighbourX >= GRID_WIDTH ||
                                neighbourY < 0 ||
                                neighbourY >= GRID_HEIGHT
                            ) {
                                return
                            }

                            neighbours += g[neighbourX][neighbourY]
                        })

                        if (neighbours < 2 || neighbours > 3) {
                            gridCopy[ii][jj] = 0
                        }

                        if (g[ii][jj] === 0 && neighbours === 3) {
                            gridCopy[ii][jj] = 1
                        }
                    }
                }
            })
        })

        setTimeout(() => runSimulation(), 100)
    }, [])

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running)
                    runningRef.current = !running
                    runSimulation()
                }}
            >
                {running ? 'stop' : 'start'}
            </button>
            <button
                onClick={() => {
                    setGrid(generateGrid())
                }}
            >
                clear
            </button>
            <button
                onClick={() => {
                    setGrid(generateGrid(randomizer))
                }}
            >
                randomize
            </button>
            <input
                type="range"
                min="1"
                max="100"
                defaultValue={randomizer * 100}
                onChange={e => {
                    setRandomizer(~~e.target.value / 100)
                }}
            />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_WIDTH}, 20px)`,
                }}
            >
                {grid.map((row, xIndex) =>
                    row.map((column, yIndex) => {
                        return (
                            <div
                                style={{
                                    width: `20px`,
                                    height: `20px`,
                                    border: `thin solid #000`,
                                    backgroundColor: `${
                                        column === 0 ? 'white' : 'black'
                                    }`,
                                }}
                                key={`${yIndex}-${xIndex}`}
                                onClick={() => {
                                    const newGrid = produce(grid, gridCopy => {
                                        gridCopy[xIndex][yIndex] = ~~!grid[
                                            xIndex
                                        ][yIndex]
                                    })
                                    setGrid(newGrid)
                                }}
                            />
                        )
                    })
                )}
            </div>
        </>
    )
}

export default GameOfLife
