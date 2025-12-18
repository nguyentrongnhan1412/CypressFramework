// ***********************************************
// Custom Commands
// ***********************************************

// Import cypress-xpath for XPath support
require('cypress-xpath');

// Import ApiClient from core
const ApiClient = require('../core/api/apiClient');

/**
 * Custom command to login via API
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Cypress.Chainable} - User data
 */
Cypress.Commands.add('loginViaApi', (username, password) => {
  const apiClient = new ApiClient();
  return apiClient.login(username, password);
});

/**
 * Custom command to add book via API
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @param {string} isbn - Book ISBN
 * @returns {Cypress.Chainable} - Response data
 */
Cypress.Commands.add('addBookViaApi', (userId, token, isbn) => {
  const apiClient = new ApiClient();
  return apiClient.addBookToCollection(userId, token, isbn);
});

/**
 * Custom command to delete book via API
 * @param {string} userId - User ID
 * @param {string} token - Authentication token
 * @param {string} isbn - Book ISBN
 * @returns {Cypress.Chainable} - Response data
 */
Cypress.Commands.add('deleteBookViaApi', (userId, token, isbn) => {
  const apiClient = new ApiClient();
  return apiClient.deleteBook(userId, token, isbn);
});

/**
 * Custom command to generate token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Cypress.Chainable} - Token
 */
Cypress.Commands.add('generateToken', (username, password) => {
  const apiClient = new ApiClient();
  return apiClient.generateToken(username, password);
});
