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

const GameOfLife = () => {
    const [running, setRunning] = useState(false)
    const runningRef = useRef(null)
    const [grid, setGrid] = useState(() => {
        const grid = []
        for (let ii = 0; ii < GRID_HEIGHT; ii++) {
            grid[ii] = Array.from(Array(GRID_WIDTH), () => 0)
        }
        return grid
    })

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
        <Fragment>
            <button
                onClick={() => {
                    setRunning(!running)
                    runningRef.current = !running
                    runSimulation()
                }}
            >
                {running ? 'stop' : 'start'}
            </button>
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
        </Fragment>
    )
}

export default GameOfLife
