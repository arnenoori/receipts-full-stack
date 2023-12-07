describe('recepts login test', () => {
  it('go to site',() => {
    cy.visit('https://receipts.boo', {
      failOnStatusCode: false
    });
    cy.contains('Get started').click()
    cy.contains('Continue with Google').click()
    cy.wait(1000000)
  })
})
