const PracticeFormPage = require('../support/pages/PracticeFormPage');
const RegisterPopup = require('../support/pages/RegisterPopup');
const practiceFormDataProvider = require('../providers/PracticeFormDataProvider');

describe('Scenario 1.2: Register student form with mandatory fields successfully', () => {
  let practiceFormPage;
  let registerPopup;
  let formData;

  beforeEach(() => {
    practiceFormPage = new PracticeFormPage();
    registerPopup = new RegisterPopup();
    
    formData = practiceFormDataProvider.generateMandatoryFields();
    
    console.log('Generated Mandatory Data:', formData);
  });

  it('should register student with mandatory fields successfully', () => {
    practiceFormPage.navigate();

    practiceFormPage.fillMandatoryFields(formData);

    practiceFormPage.submit();

    registerPopup.waitForPopupToBeVisible();
    registerPopup.verifyModalTitle('Thanks for submitting the form');

    registerPopup.verifyStudentName(formData.firstName, formData.lastName);
    registerPopup.verifyGender(formData.gender);
    registerPopup.verifyMobile(formData.mobile);
  });
});
