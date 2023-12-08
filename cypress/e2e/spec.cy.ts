// spec.cy.ts

describe('Clerk Authentication Test', () => {
  it('should sign in via Clerk after clicking "Get started"', () => {
    // Visit receipts.boo with failOnStatusCode set to false
    cy.visit('https://receipts.boo', { failOnStatusCode: false });

    // Wait for 3 seconds
    cy.wait(3000);

    // Click the 'Get started' button in the center of the screen
    cy.contains('Get started').click();

    // Perform the Clerk sign-in
    
    
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