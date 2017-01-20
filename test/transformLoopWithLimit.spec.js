/* eslint-disable no-useless-escape */
'use strict'

const transformLoopWithLimit = require('../src/transformLoopWithLimit')

describe('transformLoopWithLimit', function () {
  it('should be a function with arity 1', function () {
    expect(typeof transformLoopWithLimit).toBe('function')
    expect(transformLoopWithLimit.length).toBe(1)
  })

  describe('when invoked with an iteration limit', function () {
    const iterationLimit = 1000
    const transformLoop = transformLoopWithLimit(iterationLimit)

    it('should return a function', function () {
      expect(typeof transformLoop).toBe('function')
    })

    const loopTypes = [
      'WhileStatement',
      'ForStatement',
      'DoWhileStatement'
    ]

    loopTypes.concat('IfStatement').map(type => {
      describe(`and the result is invoked on a ${type} node`, function () {
        const nodeMock = {
          type: type,
          update: jest.fn(),
          source: jest.fn(() => `while(true){}`)
        }

        transformLoop(nodeMock)

        if (loopTypes.indexOf(type) > -1) {
          it('should prepend a variable declaration with the right value assigned to it', function () {
            expect(nodeMock.update.mock.calls[0][0]).toContain('var __ITER = ')
            expect(nodeMock.update.mock.calls[0][0]).toContain(iterationLimit)
            expect(nodeMock.update.mock.calls[0].length).toBe(1)
          })
        } else {
          it('shouldn\'t update the node', function () {
            expect(nodeMock.update.mock.calls.length).toBe(0)
          })
        }
      })
    })

    describe(`and the result is invoked on the body of loop`, function () {
      const nodeMock = {
        type: 'BlockStatement',
        update: jest.fn(),
        source: jest.fn(() => `{x = 234}`),
        parent: {
          type: loopTypes[Math.floor(Math.random() * 3)]
        }
      }

      transformLoop(nodeMock)

      it('should updated the body of the loop', function () {
        expect(nodeMock.update.mock.calls[0][0]).toBe('{ if(__ITER <=0){ throw new Error(\"Loop exceeded maximum allowed iterations\"); } x = 234 __ITER--; }')
        expect(nodeMock.update.mock.calls[0].length).toBe(1)
      })
    })
  })
})