const Alert = require('../../core/elements/alert');

class BookDeletedPopup {
    constructor() {
        this.alert = new Alert('Book Deleted Alert');
    }

    acceptAlert() {
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Book deleted.');
            return true;
        });
    }

    verifyAndAcceptAlert(expectedMessage = 'Book deleted.') {
        cy.on('window:alert', (text) => {
            expect(text).to.equal(expectedMessage);
            return true;
        });
    }

    getAlertText() {
        let alertText = '';
        
        cy.on('window:alert', (text) => {
            alertText = text;
            return true;
        });
        
        return cy.wrap(null).then(() => alertText);
    }

    setupAlertStub() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').callsFake((text) => {
                expect(text).to.equal('Book deleted.');
                return true;
            });
        });
    }

    validateBookDeletedMessage() {
        this.verifyAndAcceptAlert('Book deleted.');
    }

    waitForAlertAndAccept(timeout = 5000) {
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Book deleted.');
            return true;
        });
    }

    stubAlert() {
        return cy.window().then((win) => {
            const stub = cy.stub(win, 'alert').callsFake((text) => {
                return true;
            });
            
            return cy.wrap(stub);
        });
    }

    verifyAlertWasCalled(expectedMessage = 'Book deleted.') {
        cy.window().then((win) => {
            expect(win.alert).to.have.been.called;
            expect(win.alert).to.have.been.calledWith(expectedMessage);
        });
    }
}

module.exports = BookDeletedPopup;
