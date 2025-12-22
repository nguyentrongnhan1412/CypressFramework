const WebObject = require('../../core/elements/objectWrapper');
const Calendar = require('../../components/calendar');

class PracticeFormPage {
    constructor() {
        this.firstNameInput = new WebObject('#firstName', 'First Name Input');
        this.lastNameInput = new WebObject('#lastName', 'Last Name Input');
        this.emailInput = new WebObject('#userEmail', 'Email Input');
        this.mobileInput = new WebObject('#userNumber', 'Mobile Number Input');
        this.currentAddressInput = new WebObject('#currentAddress', 'Current Address Input');
        
        this.dateOfBirthInput = new WebObject('#dateOfBirthInput', 'Date of Birth Input');
        this.calendar = new Calendar();
        
        this.subjectsInput = new WebObject('#subjectsInput', 'Subjects Input');
        
        this.uploadPictureInput = new WebObject('#uploadPicture', 'Upload Picture Input');
        
        this.stateDropdown = new WebObject('#state', 'State Dropdown');
        this.cityDropdown = new WebObject('#city', 'City Dropdown');
        
        this.submitButton = new WebObject('#submit', 'Submit Button');
    }

    navigate() {
        cy.visit('https://demoqa.com/automation-practice-form');
    }

    fillFirstName(firstName) {
        this.firstNameInput.enterText(firstName);
    }

    fillLastName(lastName) {
        this.lastNameInput.enterText(lastName);
    }

    fillEmail(email) {
        this.emailInput.enterText(email);
    }

    _getGenderRadio(gender) {
        const selector = `input[value="${gender}"]~label`;
        return new WebObject(selector, `${gender} Gender Radio`);
    }

    selectGender(gender) {
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(gender)) {
            throw new Error(`Invalid gender: ${gender}. Must be 'Male', 'Female', or 'Other'`);
        }
        
        const genderRadio = this._getGenderRadio(gender);
        genderRadio.click();
    }

    fillMobile(mobile) {
        this.mobileInput.enterText(mobile);
    }

    selectDateOfBirth(day, month, year) {
        this.dateOfBirthInput.click();
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = months.indexOf(month) + 1;
        const monthNumeric = monthIndex.toString().padStart(2, '0');
        
        const dayFormatted = day.toString().padStart(2, '0');
        
        const dateString = `${dayFormatted}/${monthNumeric}/${year}`;
        
        this.calendar.selectDate(dateString);
    }

    fillSubjects(subjects) {
        subjects.forEach(subject => {
            this.subjectsInput.typeText(subject);
            cy.get('.subjects-auto-complete__menu').should('be.visible');
            this.subjectsInput.typeText('{enter}');
        });
    }

    _getHobbyCheckbox(hobby) {
        const selector = `//div[contains(@class, 'checkbox')]/child::label[text()='${hobby}']`;
        return new WebObject(selector, `${hobby} Hobby Checkbox`);
    }

    selectHobbies(hobbies) {
        const validHobbies = ['Sports', 'Reading', 'Music'];
        
        hobbies.forEach(hobby => {
            if (!validHobbies.includes(hobby)) {
                return;
            }
            
            const hobbyCheckbox = this._getHobbyCheckbox(hobby);
            hobbyCheckbox.click();
        });
    }

    uploadPicture(filePath) {
        this.uploadPictureInput.uploadFile(filePath);
    }

    fillCurrentAddress(address) {
        this.currentAddressInput.enterText(address);
    }

    selectState(state) {
        this.stateDropdown.click();
        
        const stateOption = new WebObject(`//div[@id='stateCity-wrapper']/descendant::div[contains(@class, 'option') and text()='${state}']`, 'State Option');
        stateOption.click({force: true});
    }

    selectCity(city) {
        this.cityDropdown.click();
        
        const cityOption = new WebObject(`//div[@id='stateCity-wrapper']/descendant::div[contains(@class, 'option') and text()='${city}']`, 'City Option');
        cityOption.click({force: true});
    }

    submit() {
        this.submitButton.click();
    }

    fillMandatoryFields(formData) {
        this.fillFirstName(formData.firstName);
        this.fillLastName(formData.lastName);
        this.selectGender(formData.gender);
        this.fillMobile(formData.mobile);
    }

    fillAllFields(formData) {
        this.fillFirstName(formData.firstName);
        this.fillLastName(formData.lastName);
        this.selectGender(formData.gender);
        this.fillMobile(formData.mobile);
        
        if (formData.email) {
            this.fillEmail(formData.email);
        }
        
        if (formData.dateOfBirth) {
            this.selectDateOfBirth(
                formData.dateOfBirth.day,
                formData.dateOfBirth.month,
                formData.dateOfBirth.year
            );
        }
        
        if (formData.subjects && formData.subjects.length > 0) {
            this.fillSubjects(formData.subjects);
        }
        
        if (formData.hobbies && formData.hobbies.length > 0) {
            this.selectHobbies(formData.hobbies);
        }
        
        if (formData.picture) {
            this.uploadPicture(formData.picture);
        }
        
        if (formData.currentAddress) {
            this.fillCurrentAddress(formData.currentAddress);
        }
        
        if (formData.state) {
            this.selectState(formData.state);
        }
        
        if (formData.city) {
            this.selectCity(formData.city);
        }
    }
}

module.exports = PracticeFormPage;
