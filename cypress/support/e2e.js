import './commands';

import 'cypress-mochawesome-reporter/register';

const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

beforeEach(() => {
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

Cypress.on('uncaught:exception', (err, runnable) => {
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
  if (!err.stack && err.message === 'Script error.') {
    return false;
  }
  return true;
});
