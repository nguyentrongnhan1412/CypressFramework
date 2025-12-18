const PracticeFormPage = require('../support/pages/PracticeFormPage');
const RegisterPopup = require('../support/pages/RegisterPopup');
const practiceFormDataProvider = require('../providers/PracticeFormDataProvider');

describe('Scenario 1.1: Register student form with all fields successfully', () => {
  let practiceFormPage;
  let registerPopup;
  let formData;

  beforeEach(() => {
    practiceFormPage = new PracticeFormPage();
    registerPopup = new RegisterPopup();
    
    formData = practiceFormDataProvider.generateAllFields();
    
    practiceFormDataProvider.logGeneratedData(formData);
  });

  it('should register student with all fields successfully', () => {
    practiceFormPage.navigate();

    practiceFormPage.fillAllFields(formData);

    practiceFormPage.submit();

    registerPopup.waitForPopupToBeVisible();
    registerPopup.verifyModalTitle('Thanks for submitting the form');

    registerPopup.verifyStudentName(formData.firstName, formData.lastName);
    registerPopup.verifyStudentEmail(formData.email);
    registerPopup.verifyGender(formData.gender);
    registerPopup.verifyMobile(formData.mobile);
    
    const formattedDOB = practiceFormDataProvider.formatDateOfBirth(formData.dateOfBirth);
    registerPopup.verifyDateOfBirth(formattedDOB);
    
    if (formData.subjects && formData.subjects.length > 0) {
      registerPopup.verifySubjects(formData.subjects.join(', '));
    }
    
    if (formData.hobbies && formData.hobbies.length > 0) {
      registerPopup.verifyHobbies(formData.hobbies.join(', '));
    }
    
    const pictureFilename = practiceFormDataProvider.getPictureFilename();
    registerPopup.verifyPicture(pictureFilename);
    
    registerPopup.verifyAddress(formData.currentAddress);
    
    registerPopup.verifyStateAndCity(formData.state, formData.city);
  });
});
