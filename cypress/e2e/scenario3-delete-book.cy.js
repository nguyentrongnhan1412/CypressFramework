const LoginPage = require('../support/pages/LoginPage');
const ProfilePage = require('../support/pages/ProfilePage');
const BookDeletedPopup = require('../support/pages/BookDeletedPopup');

describe('Scenario 3: Delete book successfully', () => {
  let loginPage;
  let profilePage;
  let bookDeletedPopup;
  let credentials;
  let bookData;
  const bookTitle = 'Git Pocket Guide';

  before(() => {
    cy.fixture('credentials/userCredentials').then((cred) => {
      credentials = cred;
    });
    
    cy.fixture('books/bookData').then((data) => {
      bookData = data.gitPocketGuide;
    });
  });

  beforeEach(() => {
    loginPage = new LoginPage();
    profilePage = new ProfilePage();
    bookDeletedPopup = new BookDeletedPopup();
  });

  it('should delete book successfully and verify it is removed', () => {
    let authToken;
    let alertText = '';

    cy.then(() => {
      cy.request({
        method: 'POST',
        url: 'https://demoqa.com/Account/v1/GenerateToken',
        body: {
          userName: credentials.username,
          password: credentials.password
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.token;
        expect(authToken).to.exist;

        return cy.request({
          method: 'DELETE',
          url: 'https://demoqa.com/BookStore/v1/Books',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: {
            userId: credentials.userId
          },
          failOnStatusCode: false
        });
      }).then((deleteResponse) => {
        return cy.request({
          method: 'POST',
          url: 'https://demoqa.com/BookStore/v1/Books',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: {
            userId: credentials.userId,
            collectionOfIsbns: [
              {
                isbn: bookData.isbn
              }
            ]
          },
          failOnStatusCode: false
        });
      }).then((addResponse) => {
        expect(addResponse.status).to.be.oneOf([201, 400]);
        if (addResponse.status === 400) {
          expect(addResponse.body.message).to.include("ISBN already present");
        }
      });
    });

    cy.on('window:alert', (text) => {
      alertText = text;
      return true;
    });

    loginPage.navigate();
    loginPage.login(credentials.username, credentials.password);
    
    profilePage.waitForPageToLoad();
    profilePage.verifyUsername(credentials.username);

    profilePage.searchBooks(bookTitle);
        
    profilePage.verifyBookIsDisplayed(bookTitle);

    profilePage.clickDeleteButtonForBook(bookTitle);
    
    profilePage.confirmAction();

    cy.wait(2000);

    cy.then(() => {
      expect(alertText).to.equal('Book deleted.');
    });

    profilePage.verifyBookIsNotDisplayed(bookTitle);
  });
});

