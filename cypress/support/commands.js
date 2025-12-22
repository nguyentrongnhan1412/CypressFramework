// ***********************************************
// Custom Commands
// ***********************************************

// Import cypress-xpath for XPath support
require('cypress-xpath');

/**
 * Custom command to generate token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Cypress.Chainable<string>} - Authentication token
 */
Cypress.Commands.add('generateToken', (username, password) => {
  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/GenerateToken',
    body: {
      userName: username,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.token).to.exist;
    return response.body.token;
  });
});

/**
 * Custom command to login via API
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Cypress.Chainable} - User data including userId and token
 */
Cypress.Commands.add('loginViaApi', (username, password) => {
  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/Login',
    body: {
      userName: username,
      password: password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    return {
      userId: response.body.userId,
      username: response.body.username,
      token: response.body.token,
      books: response.body.books
    };
  });
});

/**
 * Custom command to add book via API
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @param {string} isbn - Book ISBN
 * @returns {Cypress.Chainable} - Response data
 */
Cypress.Commands.add('addBookViaApi', (userId, token, isbn) => {
  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/BookStore/v1/Books',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: {
      userId: userId,
      collectionOfIsbns: [
        {
          isbn: isbn
        }
      ]
    },
    failOnStatusCode: false
  }).then((response) => {
    return {
      status: response.status,
      body: response.body,
      isSuccessful: response.status >= 200 && response.status < 300
    };
  });
});

/**
 * Custom command to delete book via API
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @param {string} isbn - Book ISBN
 * @returns {Cypress.Chainable} - Response data
 */
Cypress.Commands.add('deleteBookViaApi', (userId, token, isbn) => {
  return cy.request({
    method: 'DELETE',
    url: 'https://demoqa.com/BookStore/v1/Book',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: {
      userId: userId,
      isbn: isbn
    },
    failOnStatusCode: false
  }).then((response) => {
    return {
      status: response.status,
      body: response.body,
      isSuccessful: response.status >= 200 && response.status < 300
    };
  });
});

/**
 * Custom command to delete all books via API
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @returns {Cypress.Chainable} - Response data
 */
Cypress.Commands.add('deleteAllBooksViaApi', (userId, token) => {
  return cy.request({
    method: 'DELETE',
    url: 'https://demoqa.com/BookStore/v1/Books',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: {
      userId: userId
    },
    failOnStatusCode: false
  }).then((response) => {
    return {
      status: response.status,
      body: response.body,
      isSuccessful: response.status >= 200 && response.status < 300
    };
  });
});
