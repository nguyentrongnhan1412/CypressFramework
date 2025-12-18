class WebObject {
    constructor(selector, name, timeout = null) {
        this.selector = selector;
        this.name = name;
        this.timeout = timeout || Cypress.config('defaultCommandTimeout');
    }

    static getDefaultTimeout() {
        return Cypress.config('defaultCommandTimeout');
    }

    _isXPath() {
        return this.selector.startsWith('//') || 
               this.selector.startsWith('(//') ||
               this.selector.includes('contains(') ||
               this.selector.includes('child::') ||
               this.selector.includes('parent::');
    }

    _getElement(options = {}) {
        if (this._isXPath()) {
            return cy.xpath(this.selector, { timeout: this.timeout, ...options });
        }
        return cy.get(this.selector, { timeout: this.timeout, ...options });
    }

    waitForElementToBeVisible() {
        return this._getElement()
            .should('be.visible')
            .then(($el) => {
                return cy.wrap($el);
            });
    }

    waitForElementsToBeVisible() {
        return this._getElement()
            .should('be.visible')
            .then(($els) => {
                return cy.wrap($els);
            });
    }

    waitForElementToBeClickable() {
        return this._getElement()
            .should('be.visible')
            .should('not.be.disabled')
            .then(($el) => {
                return cy.wrap($el);
            });
    }

    isElementDisplayed() {
        return this._getElement()
            .should('exist')
            .then(($el) => {
                const isVisible = $el.is(':visible');
                return cy.wrap(isVisible);
            });
    }

    click(options = {}) {
        return this.waitForElementToBeClickable()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView();
            })
            .then(($el) => {
                return cy.wrap($el).click(options);
            });
    }

    forceClick() {
        return this.click({ force: true });
    }

    selectOptionFromElement(option, selectOptions = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView({ duration: 300, easing: 'swing' });
            })
            .then(($el) => {
                return cy.wrap($el).select(option, selectOptions);
            });
    }

    enterText(inputData, typeOptions = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView({ block: 'center' });
            })
            .then(($el) => {
                return cy.wrap($el).clear();
            })
            .then(($el) => {
                return cy.wrap($el).type(inputData, typeOptions);
            });
    }

    typeText(inputData, typeOptions = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView({ block: 'center' });
            })
            .then(($el) => {
                return cy.wrap($el).type(inputData, typeOptions);
            });
    }

    getTextFromElement() {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView({ block: 'center' });
            })
            .invoke('text')
            .then((text) => {
                const trimmed = text.trim();
                return cy.wrap(trimmed);
            });
    }

    getAttributeFromElement(attribute) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView({ block: 'center' });
            })
            .then(($el) => {
                const attrValue = $el.attr(attribute) || '';
                return cy.wrap(attrValue);
            });
    }

    getTextFromElements() {
        return this.waitForElementsToBeVisible()
            .then(($els) => {
                const textList = [];
                $els.each((index, el) => {
                    textList.push(Cypress.$(el).text().trim());
                });
                return cy.wrap(textList);
            });
    }

    getValueFromElement() {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                const value = $el.val() || '';
                return cy.wrap(value);
            });
    }

    elementExists() {
        return cy.get('body').then(($body) => {
            const exists = $body.find(this.selector).length > 0;
            return cy.wrap(exists);
        });
    }

    isElementEnabled() {
        return this._getElement()
            .then(($el) => {
                const isEnabled = !$el.is(':disabled');
                return cy.wrap(isEnabled);
            });
    }

    waitForElementToBeHidden() {
        return this._getElement()
            .should('not.be.visible');
    }

    waitForElementToNotExist() {
        return cy.get(this.selector, { timeout: this.timeout }).should('not.exist');
    }

    hover() {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).trigger('mouseover');
            });
    }

    doubleClick(options = {}) {
        return this.waitForElementToBeClickable()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView();
            })
            .then(($el) => {
                return cy.wrap($el).dblclick(options);
            });
    }

    rightClick(options = {}) {
        return this.waitForElementToBeClickable()
            .then(($el) => {
                return cy.wrap($el).scrollIntoView();
            })
            .then(($el) => {
                return cy.wrap($el).rightclick(options);
            });
    }

    check(options = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).check(options);
            });
    }

    uncheck(options = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).uncheck(options);
            });
    }

    uploadFile(filePath, options = {}) {
        return this.waitForElementToBeVisible()
            .then(($el) => {
                return cy.wrap($el).selectFile(filePath, options);
            });
    }

    static click(selector, name, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.click();
    }

    static enterText(selector, name, inputData, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.enterText(inputData);
    }

    static getText(selector, name, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.getTextFromElement();
    }

    static selectOption(selector, name, option, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.selectOptionFromElement(option);
    }

    static getAttribute(selector, name, attribute, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.getAttributeFromElement(attribute);
    }

    static isDisplayed(selector, name, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.isElementDisplayed();
    }

    static waitVisible(selector, name, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.waitForElementToBeVisible();
    }

    static waitClickable(selector, name, timeout = null) {
        const webObject = new WebObject(selector, name, timeout);
        return webObject.waitForElementToBeClickable();
    }
}

module.exports = WebObject;
