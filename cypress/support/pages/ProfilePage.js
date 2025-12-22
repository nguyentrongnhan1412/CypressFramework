const WebObject = require('../../core/elements/objectWrapper');
const Alert = require('../../core/elements/alert');

class ProfilePage {
    constructor() {
        this.userNameValue = new WebObject('#userName-value', 'Username Value');
        
        this.logoutButton = new WebObject('#submit', 'Logout Button');
        this.goToBookStoreButton = new WebObject('#gotoStore', 'Go To Book Store Button');
        this.deleteAllBooksButton = new WebObject('.text-right button', 'Delete All Books Button');
        this.deleteAccountButton = new WebObject('.text-right button:nth-child(2)', 'Delete Account Button');
        
        this.searchBox = new WebObject('#searchBox', 'Search Box');
        
        this.booksTable = new WebObject('.rt-table', 'Books Table');
        this.bookRows = new WebObject('.rt-tr-group', 'Book Rows');
        
        this.noRowsMessage = new WebObject('.rt-noData', 'No Rows Found Message');
        
        this.alert = new Alert('Profile Page Alert');
    }

    navigate() {
        cy.visit('https://demoqa.com/profile');
    }

    waitForPageToLoad() {
        cy.get('body').should('be.visible');
        this.userNameValue.waitForElementToBeVisible();
    }

    getUsername() {
        return this.userNameValue.getTextFromElement().then(username => {
            return cy.wrap(username);
        });
    }

    verifyUsername(expectedUsername) {
        this.getUsername().then(actualUsername => {
            expect(actualUsername).to.equal(expectedUsername);
        });
    }

    searchBooks(searchText) {
        this.searchBox.enterText(searchText);
    }

    clearSearch() {
        this.searchBox.enterText('{selectall}{backspace}');
    }

    getBookTitles() {
        return cy.get('.rt-tbody .rt-tr-group').then($rows => {
            const titles = [];
            
            $rows.each((index, row) => {
                const $titleLink = Cypress.$(row).find('.rt-td:nth-child(2) a');
                const title = $titleLink.text().trim();
                
                if (title) {
                    titles.push(title);
                }
            });
            
            return cy.wrap(titles);
        });
    }

    getBooks() {
        return cy.get('.rt-tbody .rt-tr-group').then($rows => {
            const books = [];
            
            $rows.each((index, row) => {
                const $cells = Cypress.$(row).find('.rt-td');
                
                if ($cells.length >= 4) {
                    const title = $cells.eq(1).find('a').text().trim();
                    const author = $cells.eq(2).text().trim();
                    const publisher = $cells.eq(3).text().trim();
                    
                    if (title) {
                        books.push({
                            title: title,
                            author: author,
                            publisher: publisher
                        });
                    }
                }
            });
            
            return cy.wrap(books);
        });
    }

    verifyBookIsDisplayed(bookTitle) {
        this.getBookTitles().then(titles => {
            const isDisplayed = titles.includes(bookTitle);
            expect(isDisplayed).to.be.true;
        });
    }

    verifyBookIsNotDisplayed(bookTitle) {
        this.getBookTitles().then(titles => {
            const isDisplayed = titles.includes(bookTitle);
            expect(isDisplayed).to.be.false;
        });
    }

    areBooksDisplayed() {
        return this.getBookTitles().then(titles => {
            const hasBooks = titles.length > 0;
            return cy.wrap(hasBooks);
        });
    }

    isNoRowsMessageDisplayed() {
        return cy.get('body').then($body => {
            const noRowsExists = $body.find('.rt-noData').length > 0;
            
            if (noRowsExists) {
                return cy.get('.rt-noData').then($el => {
                    const isVisible = $el.is(':visible');
                    return cy.wrap(isVisible);
                });
            }
            
            return cy.wrap(false);
        });
    }

    clickBookByTitle(bookTitle) {
        cy.contains('.rt-tbody a', bookTitle)
            .scrollIntoView()
            .click();
    }

    clickDeleteButtonForBook(bookTitle) {
        cy.contains('.rt-tbody .rt-tr-group', bookTitle)
            .find('#delete-record-undefined')
            .scrollIntoView()
            .click();
    }

    clickDeleteAllBooks() {
        cy.contains('button', 'Delete All Books').click();
    }

    clickDeleteAccount() {
        cy.contains('button', 'Delete Account').click();
    }

    clickLogout() {
        this.logoutButton.click();
    }

    clickGoToBookStore() {
        this.goToBookStoreButton.click();
    }

    confirmAction() {
        cy.get('#closeSmallModal-ok').click();
    }

    cancelAction() {
        cy.get('#closeSmallModal-cancel').click();
    }

    getBookCount() {
        return this.getBookTitles().then(titles => {
            const count = titles.length;
            return cy.wrap(count);
        });
    }

    waitForBookToAppear(bookTitle, timeout = 10000) {
        cy.contains('.rt-tbody a', bookTitle, { timeout: timeout }).should('be.visible');
    }

    waitForBookToDisappear(bookTitle, timeout = 10000) {
        cy.get('body').then($body => {
            const bookExists = $body.find('.rt-tbody a').filter((i, el) => {
                return Cypress.$(el).text().trim() === bookTitle;
            }).length > 0;
            
            if (bookExists) {
                cy.contains('.rt-tbody a', bookTitle, { timeout: timeout }).should('not.exist');
            }
        });
    }
}

module.exports = ProfilePage;
