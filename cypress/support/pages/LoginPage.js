const WebObject = require('../../core/elements/objectWrapper');

class LoginPage {
    constructor() {
        this.usernameInput = new WebObject('#userName', 'Username Input');
        this.passwordInput = new WebObject('#password', 'Password Input');
        
        this.loginButton = new WebObject('#login', 'Login Button');
        this.newUserButton = new WebObject('#newUser', 'New User Button');
        
        this.errorMessage = new WebObject('#name', 'Error Message');
        this.outputMessage = new WebObject('#output', 'Output Message');
    }

    navigate() {
        cy.visit('https://demoqa.com/login');
    }

    waitForPageToLoad() {
        this.usernameInput.waitForElementToBeVisible();
    }

    fillUsername(username) {
        this.usernameInput.enterText(username);
    }

    fillPassword(password) {
        this.passwordInput.enterText(password);
    }

    clickLogin() {
        this.loginButton.click();
    }

    clickNewUser() {
        this.newUserButton.click();
    }

    login(username, password) {
        this.fillUsername(username);
        this.fillPassword(password);
        this.clickLogin();
    }

    loginWithCredentials(credentials) {
        this.login(credentials.username, credentials.password);
    }

    isErrorMessageDisplayed() {
        return cy.get('body').then($body => {
            const errorExists = $body.find('#name, #output, .mb-1').length > 0;
            
            if (errorExists) {
                return cy.get('#name, #output, .mb-1').then($el => {
                    const isVisible = $el.is(':visible');
                    return isVisible;
                });
            }
            
            return false;
        });
    }

    getErrorMessage() {
        return cy.get('body').then($body => {
            if ($body.find('#name').length > 0) {
                return cy.get('#name').invoke('text');
            } else if ($body.find('#output').length > 0) {
                return cy.get('#output').invoke('text');
            } else {
                return '';
            }
        });
    }

    verifyLoginSuccessful() {
        cy.url().should('include', '/profile');
    }

    verifyLoginFailed(expectedErrorMessage = null) {
        cy.url().should('include', '/login');
        
        if (expectedErrorMessage) {
            this.getErrorMessage().then(actualMessage => {
                expect(actualMessage).to.include(expectedErrorMessage);
            });
        }
    }

    clearForm() {
        this.usernameInput.enterText('{selectall}{backspace}');
        this.passwordInput.enterText('{selectall}{backspace}');
    }
}

module.exports = LoginPage;
