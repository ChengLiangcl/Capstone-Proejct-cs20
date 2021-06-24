import { testables } from './SOM'

// Set up testing data
const vectorDim = 2
const xDim = 2
const yDim = 2
const lines = [
    "0 0",
    "1 0",
    "0 3",
    "2 2"
]
const vectorGrid = [
    [[0, 0], [1, 0]],
    [[0, 3], [2, 2]]
]
let som = new testables.SOM([
    [ 
        new testables.Node(0, 0, [0, 0], null),
        new testables.Node(0, 1, [1, 0], null)
    ],
    [ 
        new testables.Node(1, 0, [0, 3], null),
        new testables.Node(1, 1, [2, 2], null)
    ]
], 2, 2, 2);
som.calculateAllNeighbours()

test('getVectorGrid', () => {
    expect(testables.getVectorGrid(lines, vectorDim, xDim, yDim)).toEqual(vectorGrid)
})

test('constructSOM', () => {
    expect(testables.constructSOM(vectorGrid, vectorDim, xDim, yDim)).toEqual(som)
})

describe('Node tests', () => {
    // this node is at coordinates (0, 0) and is associated with vector (0, 0)
    const node = som.grid[0][0]

    test('getDistance', () => {
        expect(node.getDistance('right')).toBeCloseTo(1)
        expect(node.getDistance('left')).toBe(null)
    })

    test('getAverageDistance', () => {
        expect(node.getAverageDistance()).toBeCloseTo(2)
    })

    test('getMaxDistance', () => {
        expect(node.getMaxDistance()).toBeCloseTo(3)
    })

    test('test neighbours', () => {
        expect(node.neighbours['right']).toBe(som.grid[0][1])
        expect(node.neighbours['bottom-right']).toBe(som.grid[1][0])
        expect(node.neighbours['top-left']).toBe(undefined)
    })
})

describe('SOM tests', () => {
    test('inBounds', () => {
        expect(som.inBounds(0, 1)).toBe(true)
        expect(som.inBounds(-1, 1)).toBe(false)
        expect(som.inBounds(3, 1)).toBe(false)
    })

    test('neighbourCalculators', () => {
        const neighbourCalculators = som.neighbourCalculators(0, 0)
        expect(neighbourCalculators['right']()).toEqual([1, 0])
        expect(neighbourCalculators['bottom-right']()).toEqual([0, 1])
    })

    test('getMaxDistance', () => {
        expect(som.getMaxDistance()).toBeCloseTo(Math.sqrt(10))
    })

})