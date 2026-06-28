// spec.cy.ts

describe('Clerk Authentication Test', () => {
  it('should sign in via Clerk after clicking "Get started"', () => {
    // Stub the network requests to Clerk's servers
    cy.intercept('POST', '**/clerk/sessions', {
      statusCode: 200,
      body: {
        // The body should match the structure of a successful response from Clerk's servers
        // You can find this structure in Clerk's API documentation
        // For example:
        id: 'session-id',
        userId: 'user-id',
        // ... other properties
      },
    });

    // Visit receipts.boo with failOnStatusCode set to false
    cy.visit('https://receipts.boo', { failOnStatusCode: false });

    // Wait for 3 seconds
    cy.wait(3000);

    // Click the 'Get started' button in the center of the screen
    cy.contains('Get started').click();

    // Perform the Clerk sign-in
    cy.contains('Continue with Google').click();
  });
});

// describe('website navigation test', () => {
//   it('should sign in via Clerk after clicking "Get started" then navigate to all pages of the site', () => {
//     // Visit receipts.boo with failOnStatusCode set to false
//     cy.visit('https://www.receipts.boo', { failOnStatusCode: false });

//     // Wait for 3 seconds
//     cy.wait(3000);

//     // Click the 'Get started' button in the center of the screen
//     cy.contains('Get started').click();

//     // Perform the Clerk sign-in

//     // Click on "budgets"
//     cy.contains('budgets').click();

//     // Wait for the "budgets" page to load
//     cy.wait(2000);

//     // Click on "chat"
//     cy.contains('chat').click();

//     // Wait for the "chat" page to load
//     cy.wait(2000);
//     });
// });