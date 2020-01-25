import React, { useState, useCallback, useRef } from 'react'
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

    const runningRef = useRef(running)
    runningRef.current = running

    const runSimulation = useCallback(() => {
        if (!runningRef.current) return

        setGrid(g =>
            produce(g, gridCopy => {
                for (let ii = 0; ii < GRID_WIDTH; ii++) {
                    for (let jj = 0; jj < GRID_HEIGHT; jj++) {
                        let neighbours = 0
                        gridNeighbourOperations.forEach(([deltaX, deltaY]) => {
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

                        if (neighbours === 3 && !g[ii][jj]) {
                            gridCopy[ii][jj] = 1
                        }
                    }
                }
            })
        )

        setTimeout(() => runSimulation(), 16)
    }, [])

    const generateEmptyGrid = useCallback(() => {
        setGrid(generateGrid())
    }, [])

    const generateRandomGrid = useCallback(() => {
        setGrid(generateGrid(randomizer))
    }, [randomizer])
    const onSetRandomizer = useCallback(event => {
        setRandomizer(~~event.target.value / 100)
    }, [])

    const onStartSimulation = useCallback(() => {
        setRunning(!running)
        runningRef.current = !running
        runSimulation()
    }, [runSimulation, running])

    const onClickCell = useCallback(event => {
        const { x, y } = event.target.dataset
        setGrid(g =>
            produce(g, gridCopy => {
                gridCopy[x][y] = ~~!g[x][y]
            })
        )
    }, [])

    return (
        <>
            <button onClick={onStartSimulation} type="button">
                {running ? 'stop' : 'start'}
            </button>
            <button onClick={generateEmptyGrid} type="button">
                clear
            </button>
            <button onClick={generateRandomGrid} type="button">
                randomize
            </button>
            <input
                defaultValue={randomizer * 100}
                max="100"
                min="1"
                onChange={onSetRandomizer}
                type="range"
            />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_WIDTH}, 20px)`,
                }}
            >
                {grid.map((row, x) =>
                    row.map((cell, y) => (
                        <div
                            data-x={x}
                            data-y={y}
                            key={`${x}-${y}`}
                            onClick={onClickCell}
                            style={{
                                width: `20px`,
                                height: `20px`,
                                border: `thin solid #000`,
                                backgroundColor: `${
                                    cell === 0 ? 'white' : 'black'
                                }`,
                            }}
                        />
                    ))
                )}
            </div>
        </>
    )
}

export default GameOfLife
