import chai from 'chai'

import message from '../src/index'
const expect = chai.expect

describe('Valid test case', () => {
  const expectedMessage = 'Test: dSafe is going make Safe and fee'
  it('Should return correct message', () => {
    expect(message).to.equal(expectedMessage)
  })
})
