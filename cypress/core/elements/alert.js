class Alert {
    constructor(name, timeout = null) {
        this.name = name;
        this.timeout = timeout || Cypress.config('defaultCommandTimeout');
    }

    static getDefaultTimeout() {
        return Cypress.config('defaultCommandTimeout');
    }

    _waitForAlertToBePresent() {
        return cy.window({ timeout: this.timeout }).then((win) => {
            return cy.wrap(win, { timeout: this.timeout });
        });
    }

    acceptAlert() {
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:alert', (text) => {
                return true;
            });
            
            cy.on('window:confirm', (text) => {
                return true;
            });
        });
    }

    dismissAlert() {
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:confirm', (text) => {
                return false;
            });
        });
    }

    getAlertText() {
        let alertText = '';
        
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:alert', (text) => {
                alertText = text;
                return true;
            });
            
            cy.on('window:confirm', (text) => {
                alertText = text;
                return true;
            });
            
            cy.on('window:prompt', (text) => {
                alertText = text;
                return null;
            });
        }).then(() => {
            return cy.wrap(alertText);
        });
    }

    respondToPrompt(response) {
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:prompt', (text) => {
                return response;
            });
        });
    }

    validateAlertText(expectedText) {
        let actualText = '';
        
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:alert', (text) => {
                actualText = text;
                return true;
            });
            
            cy.on('window:confirm', (text) => {
                actualText = text;
                return true;
            });
            
            cy.on('window:prompt', (text) => {
                actualText = text;
                return null;
            });
        }).then(() => {
            expect(actualText).to.equal(expectedText);
        });
    }

    validateAlertTextContains(substring) {
        let actualText = '';
        
        return cy.window({ timeout: this.timeout }).then((win) => {
            cy.on('window:alert', (text) => {
                actualText = text;
                return true;
            });
            
            cy.on('window:confirm', (text) => {
                actualText = text;
                return true;
            });
            
            cy.on('window:prompt', (text) => {
                actualText = text;
                return null;
            });
        }).then(() => {
            expect(actualText).to.include(substring);
        });
    }

    static accept(name, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.acceptAlert();
    }

    static dismiss(name, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.dismissAlert();
    }

    static getText(name, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.getAlertText();
    }

    static respondTo(name, response, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.respondToPrompt(response);
    }

    static validate(name, expectedText, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.validateAlertText(expectedText);
    }

    static validateContains(name, substring, timeout = null) {
        const alert = new Alert(name, timeout);
        return alert.validateAlertTextContains(substring);
    }

    static captureAlert(name, callback = null) {
        let capturedText = '';
        
        cy.window().then((win) => {
            cy.stub(win, 'alert').callsFake((text) => {
                capturedText = text;
                if (callback) callback(text);
                return true;
            });
        });
        
        return cy.wrap(null).then(() => capturedText);
    }

    static captureConfirm(name, accept = true, callback = null) {
        let capturedText = '';
        
        cy.window().then((win) => {
            cy.stub(win, 'confirm').callsFake((text) => {
                capturedText = text;
                if (callback) callback(text);
                return accept;
            });
        });
        
        return cy.wrap(null).then(() => capturedText);
    }

    static capturePrompt(name, response = null, callback = null) {
        let capturedText = '';
        
        cy.window().then((win) => {
            cy.stub(win, 'prompt').callsFake((text, defaultValue) => {
                capturedText = text;
                if (callback) callback(text, defaultValue);
                return response;
            });
        });
        
        return cy.wrap(null).then(() => capturedText);
    }
}

module.exports = Alert;
