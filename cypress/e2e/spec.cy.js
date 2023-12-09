Cypress.Commands.add(`signOut`, () => {
  cy.log(`sign out by clearing all cookies.`);
  cy.clearCookies({ domain: null });
});

Cypress.Commands.add(`signIn`, () => {
  cy.log(`Signing in.`);
  // Visit receipts.boo with failOnStatusCode set to false
  cy.visit('https://receipts.boo', { failOnStatusCode: false })

  // Click the 'Get started' button in the center of the screen
  cy.contains('Get started').click()

  cy.wait(1000)

  cy.contains('Sign in').click()

  cy.wait(1000)
 
  // Click the 'Get started' button in the center of the screen
  // cy.contains('Continue with Google').click()

  // cy.wait(10000)

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      await cy.clearCookies({ domain: window.location.domain });
      const res = await window.Clerk.client.signIn.create({
        identifier: Cypress.env(`test_email`),
        password: Cypress.env(`test_password`),
      });
 
      await window.Clerk.setActive({
        session: res.createdSessionId,
      });
 
      cy.log(`Finished Signing in.`);
    });
});

describe('Signed in', () => {
  beforeEach(() => {
    cy.session('signed-in', () => {
      cy.signIn()
    })
  })

  it('navigate to the dashboard', () => {
    cy.visit('https://www.receipts.boo/s', { failOnStatusCode: false })
    // Wait for 3 seconds
    cy.wait(10000)
  })
})
