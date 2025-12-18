const WebObject = require('../../core/elements/objectWrapper');

class RegisterPopup {
    constructor() {
        this.modal = new WebObject('.modal-content', 'Registration Success Modal');
        this.modalHeader = new WebObject('.modal-header', 'Modal Header');
        this.modalTitle = new WebObject('#example-modal-sizes-title-lg', 'Modal Title');
        this.modalBody = new WebObject('.modal-body', 'Modal Body');
        this.closeButton = new WebObject('#closeLargeModal', 'Close Button');
        
        this.dataTable = new WebObject('.table', 'Submitted Data Table');
    }

    waitForPopupToBeVisible(timeout = 10000) {
        const modalWithTimeout = new WebObject('.modal-content', 'Registration Success Modal', timeout);
        modalWithTimeout.waitForElementToBeVisible();
    }

    isPopupDisplayed() {
        return this.modal.isElementDisplayed();
    }

    getModalTitle() {
        return this.modalTitle.getTextFromElement();
    }

    verifyModalTitle(expectedText = 'Thanks for submitting the form') {
        return this.getModalTitle().then(actualTitle => {
            expect(actualTitle).to.include(expectedText);
        });
    }

    getSubmittedData() {
        return cy.get('.table tbody tr').then($rows => {
            const data = {};
            
            $rows.each((index, row) => {
                const $cells = Cypress.$(row).find('td');
                if ($cells.length === 2) {
                    const label = $cells.eq(0).text().trim();
                    const value = $cells.eq(1).text().trim();
                    data[label] = value;
                }
            });
            
            return cy.wrap(data);
        });
    }

    getFieldValue(label) {
        return cy.get('.table tbody tr').then($rows => {
            let fieldValue = '';
            
            $rows.each((index, row) => {
                const $cells = Cypress.$(row).find('td');
                if ($cells.length === 2) {
                    const rowLabel = $cells.eq(0).text().trim();
                    if (rowLabel === label) {
                        fieldValue = $cells.eq(1).text().trim();
                    }
                }
            });
            
            return cy.wrap(fieldValue);
        });
    }

    verifyFieldValue(label, expectedValue) {
        return this.getFieldValue(label).then(actualValue => {
            expect(actualValue).to.equal(expectedValue);
        });
    }

    verifyFieldContains(label, expectedText) {
        return this.getFieldValue(label).then(actualValue => {
            expect(actualValue).to.include(expectedText);
        });
    }

    verifySubmittedData(expectedData) {
        return this.getSubmittedData().then(actualData => {
            Object.keys(expectedData).forEach(label => {
                const expectedValue = expectedData[label];
                const actualValue = actualData[label];
                
                if (actualValue) {
                    expect(actualValue).to.equal(expectedValue);
                } else {
                    throw new Error(`Field "${label}" not found in submitted data`);
                }
            });
        });
    }

    verifyStudentName(firstName, lastName) {
        const expectedName = `${firstName} ${lastName}`;
        return this.verifyFieldValue('Student Name', expectedName);
    }

    verifyStudentEmail(email) {
        return this.verifyFieldValue('Student Email', email);
    }

    verifyGender(gender) {
        return this.verifyFieldValue('Gender', gender);
    }

    verifyMobile(mobile) {
        return this.verifyFieldValue('Mobile', mobile);
    }

    verifyDateOfBirth(dateOfBirth) {
        return this.verifyFieldValue('Date of Birth', dateOfBirth);
    }

    verifySubjects(subjects) {
        return this.verifyFieldValue('Subjects', subjects);
    }

    verifyHobbies(hobbies) {
        return this.verifyFieldValue('Hobbies', hobbies);
    }

    verifyPicture(pictureFilename) {
        return this.verifyFieldValue('Picture', pictureFilename);
    }

    verifyAddress(address) {
        return this.verifyFieldValue('Address', address);
    }

    verifyStateAndCity(state, city) {
        const expectedValue = `${state} ${city}`;
        return this.verifyFieldValue('State and City', expectedValue);
    }

    closePopup() {
        this.closeButton.click();
    }

    waitForPopupToBeHidden() {
        this.modal.waitForElementToBeHidden();
    }
}

module.exports = RegisterPopup;
