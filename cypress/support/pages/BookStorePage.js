const WebObject = require('../../core/elements/objectWrapper');

class BookStorePage {
    constructor() {
        this.searchBox = new WebObject('#searchBox', 'Search Box');
        
        this.bookRows = new WebObject('.rt-tr-group', 'Book Rows');
        
        this.loginButton = new WebObject('#login', 'Login Button');
        
        this.paginationButtons = new WebObject('.pagination button', 'Pagination Buttons');
        this.rowsSelectDropdown = new WebObject('select[aria-label="rows per page"]', 'Rows Per Page Dropdown');
        
        this.noRowsMessage = new WebObject('.rt-noData', 'No Rows Found Message');
    }

    navigate() {
        cy.visit('https://demoqa.com/books');
    }

    waitForPageToLoad() {
        cy.get('body').should('be.visible');
    }

    searchBooks(searchText) {
        this.searchBox.enterText(searchText);
        
        cy.wait(1000);
    }

    clearSearch() {
        this.searchBox.enterText('{selectall}{backspace}');
        cy.wait(500);
    }

    getVisibleBookTitles() {
        return cy.get('.rt-tbody .rt-tr-group').then($rows => {
            const titles = [];
            
            $rows.each((index, row) => {
                const $titleLink = Cypress.$(row).find('.action-buttons a');
                const title = $titleLink.text().trim();
                
                if (title) {
                    titles.push(title);
                }
            });
            
            return titles;
        });
    }

    getVisibleBooks() {
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
            
            return books;
        });
    }

    verifyAllBooksContainSearchTerm(searchTerm) {
        this.getVisibleBookTitles().then(titles => {
            if (titles.length === 0) {
                return;
            }
            
            titles.forEach(title => {
                const containsTerm = title.toLowerCase().includes(searchTerm.toLowerCase());
                expect(containsTerm).to.be.true;
            });
        });
    }

    areBooksDisplayed() {
        return this.getVisibleBookTitles().then(titles => {
            const hasBooks = titles.length > 0;
            return hasBooks;
        });
    }

    isNoRowsMessageDisplayed() {
        return cy.get('body').then($body => {
            const noRowsExists = $body.find('.rt-noData').length > 0;
            
            if (noRowsExists) {
                return cy.get('.rt-noData').then($el => {
                    const isVisible = $el.is(':visible');
                    return isVisible;
                });
            }
            
            return false;
        });
    }

    clickBookByTitle(bookTitle) {
        cy.contains('.rt-tbody .action-buttons a', bookTitle)
            .scrollIntoView()
            .click();
    }

    verifyBookIsDisplayed(bookTitle) {
        this.getVisibleBookTitles().then(titles => {
            const isDisplayed = titles.includes(bookTitle);
            expect(isDisplayed).to.be.true;
        });
    }

    verifyBookIsNotDisplayed(bookTitle) {
        this.getVisibleBookTitles().then(titles => {
            const isDisplayed = titles.includes(bookTitle);
            expect(isDisplayed).to.be.false;
        });
    }

    getBookCount() {
        return this.getVisibleBookTitles().then(titles => {
            return titles.length;
        });
    }

    clickLogin() {
        this.loginButton.click();
    }

    selectRowsPerPage(rowCount) {
        this.rowsSelectDropdown.selectOptionFromElement(rowCount);
        cy.wait(500);
    }
}

module.exports = BookStorePage;
