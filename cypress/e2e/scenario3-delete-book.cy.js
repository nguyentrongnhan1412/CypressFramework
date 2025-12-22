const LoginPage = require('../support/pages/LoginPage');
const ProfilePage = require('../support/pages/ProfilePage');
const BookDeletedPopup = require('../support/pages/BookDeletedPopup');
const ApiClient = require('../core/api/apiClient');

describe('Scenario 3: Delete book successfully', () => {
  let loginPage;
  let profilePage;
  let bookDeletedPopup;
  let api;
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
    api = new ApiClient('https://demoqa.com');
  });

  it('should delete book successfully and verify it is removed', () => {
    // Generate token
    api.post('/Account/v1/GenerateToken', {
      userName: credentials.username,
      password: credentials.password
    }).then((response) => {
      expect(response.status).to.eq(200);
      const token = response.body.token;
      expect(token).to.exist;

      // Set auth token for subsequent requests
      api.setAuthToken(token);

      // Delete all books
      return api.delete('/BookStore/v1/Books', {
        body: { userId: credentials.userId },
        failOnStatusCode: false
      });
    }).then(() => {
      // Add the test book
      return api.post('/BookStore/v1/Books', {
        userId: credentials.userId,
        collectionOfIsbns: [{ isbn: bookData.isbn }]
      }, {
        failOnStatusCode: false
      });
    }).then((addResponse) => {
      expect(addResponse.status).to.be.oneOf([201, 400]);
      if (addResponse.status === 400) {
        expect(addResponse.body.message).to.include("ISBN already present");
      }
    });

    loginPage.navigate();
    
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    loginPage.login(credentials.username, credentials.password);
    
    profilePage.waitForPageToLoad();
    profilePage.verifyUsername(credentials.username);

    profilePage.searchBooks(bookTitle);
        
    profilePage.verifyBookIsDisplayed(bookTitle);

    profilePage.clickDeleteButtonForBook(bookTitle);
    
    profilePage.confirmAction();

    cy.get('@alertStub').should('have.been.calledWith', 'Book deleted.');

    profilePage.verifyBookIsNotDisplayed(bookTitle);
  });
});

