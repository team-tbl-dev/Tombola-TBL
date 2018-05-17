module.exports = {
  expectThrow: async promise => {
    try {
      await promise
    } catch (error) {
      const invalidJump = error.message.search('invalid JUMP') >= 0
      const invalidOpcode = error.message.search('invalid opcode') >= 0
      const outOfGas = error.message.search('out of gas') >= 0
      const revert = error.message.search('Error: VM Exception while processing transaction: revert') >= 0
      assert(invalidJump || invalidOpcode || outOfGas || revert, "Expected throw, got '" + error + "' instead")
      return
    }
    assert.fail('Expected throw not received')
  }
}
