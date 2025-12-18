// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import mochawesome reporter
import 'cypress-mochawesome-reporter/register';

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Block ads and tracking scripts to prevent browser crashes
beforeEach(() => {
  // Intercept and block ad/tracking domains
  const blockedDomains = [
    '*doubleclick.net*',
    '*googlesyndication.com*',
    '*google-analytics.com*',
    '*googletagmanager.com*',
    '*adroll.com*',
    '*openx.net*',
    '*pagead*',
    '*ads*',
    '*analytics*',
    '*tracking*',
    '*pixel*',
    '*facebook.com*',
    '*criteo*',
    '*adnxs*',
    '*pubmatic*',
    '*bidswitch*',
    '*rubiconproject*',
    '*taboola*',
    '*outbrain*',
    '*spotxchange*',
    '*advertising*'
  ];

  blockedDomains.forEach(domain => {
    cy.intercept(domain, { statusCode: 200, body: '' });
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // Handle common cross-origin script errors and other known issues
  if (
    err.message.includes('ResizeObserver loop limit exceeded') ||
    err.message.includes('Script error') ||
    err.message.includes('Non-Error promise rejection captured') ||
    err.message.includes('cross origin') ||
    err.message.includes('Failed to fetch') ||
    err.message.includes('Load failed') ||
    err.message.includes('Network request failed') ||
    err.message.includes('NetworkError') ||
    err.message.includes('is not a function') ||
    err.message.includes('setup is not a function') ||
    err.message.includes('adplus') ||
    err.message.includes('ad.plus') ||
    err.message.includes('Cannot read property') ||
    err.message.includes('Cannot read properties of undefined') ||
    err.message.includes('Cannot read properties of null') ||
    err.message.includes("reading 'map'")
  ) {
    return false;
  }
  // Check if error is from ad-related domains
  if (err.stack && (
    err.stack.includes('ad.plus') ||
    err.stack.includes('doubleclick') ||
    err.stack.includes('googlesyndication') ||
    err.stack.includes('googletagmanager') ||
    err.stack.includes('adroll') ||
    err.stack.includes('openx')
  )) {
    return false;
  }
  // Also check for cross-origin script errors by checking if error has no stack trace
  if (!err.stack && err.message === 'Script error.') {
    return false;
  }
  return true;
});
