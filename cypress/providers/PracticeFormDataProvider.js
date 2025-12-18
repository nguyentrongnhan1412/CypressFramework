const { faker } = require('@faker-js/faker');

/**
 * PracticeFormDataProvider - Generates fake data for the Practice Form
 * Uses @faker-js/faker for realistic test data generation
 * Picture field always uses the fixture file at cypress/fixtures/assets/avatar.png
 */
class PracticeFormDataProvider {
    constructor() {
        // Available options for form fields
        this.genderOptions = ['Male', 'Female', 'Other'];
        
        this.subjectOptions = [
            'Maths',
            'Accounting',
            'Arts',
            'Social Studies',
            'Biology',
            'Physics',
            'Chemistry',
            'Computer Science',
            'Commerce',
            'Economics',
            'Civics',
            'Hindi',
            'English',
            'History'
        ];
        
        this.hobbyOptions = ['Sports', 'Reading', 'Music'];
        
        this.monthOptions = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // State and City mapping (based on demoqa.com practice form)
        this.stateAndCityMapping = {
            'NCR': ['Delhi', 'Gurgaon', 'Noida'],
            'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
            'Haryana': ['Karnal', 'Panipat'],
            'Rajasthan': ['Jaipur', 'Jaiselmer']
        };
        
        // Picture path - always use the avatar from fixtures
        this.picturePath = 'cypress/fixtures/assets/avatar.png';
    }

    /**
     * Generates a random first name
     * @returns {string} First name
     */
    generateFirstName() {
        return faker.person.firstName();
    }

    /**
     * Generates a random last name
     * @returns {string} Last name
     */
    generateLastName() {
        return faker.person.lastName();
    }

    /**
     * Generates a random email address
     * @returns {string} Email address
     */
    generateEmail() {
        return faker.internet.email();
    }

    /**
     * Generates a random gender from available options
     * @returns {string} Gender ('Male', 'Female', or 'Other')
     */
    generateGender() {
        return faker.helpers.arrayElement(this.genderOptions);
    }

    /**
     * Generates a random 10-digit mobile number
     * @returns {string} Mobile number (10 digits)
     */
    generateMobile() {
        // Generate a 10-digit number starting with non-zero digit
        const firstDigit = faker.number.int({ min: 1, max: 9 });
        const remainingDigits = faker.string.numeric(9);
        return `${firstDigit}${remainingDigits}`;
    }

    /**
     * Generates a random date of birth
     * @param {number} minAge - Minimum age (default: 18)
     * @param {number} maxAge - Maximum age (default: 65)
     * @returns {object} Date of birth object with day, month, and year
     */
    generateDateOfBirth(minAge = 18, maxAge = 65) {
        const birthDate = faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' });
        
        return {
            day: birthDate.getDate().toString(),
            month: this.monthOptions[birthDate.getMonth()],
            year: birthDate.getFullYear().toString()
        };
    }

    /**
     * Generates a formatted date of birth string for verification
     * @param {object} dateOfBirth - Date of birth object with day, month, year
     * @returns {string} Formatted date string (e.g., "15 January,1990")
     */
    formatDateOfBirth(dateOfBirth) {
        return `${dateOfBirth.day.padStart(2, '0')} ${dateOfBirth.month},${dateOfBirth.year}`;
    }

    /**
     * Generates random subjects
     * @param {number} count - Number of subjects to generate (default: random 1-3)
     * @returns {string[]} Array of subjects
     */
    generateSubjects(count = null) {
        if (count === null) {
            count = faker.number.int({ min: 1, max: 3 });
        }
        
        return faker.helpers.arrayElements(this.subjectOptions, count);
    }

    /**
     * Generates random hobbies
     * @param {number} count - Number of hobbies to generate (default: random 1-3)
     * @returns {string[]} Array of hobbies
     */
    generateHobbies(count = null) {
        if (count === null) {
            count = faker.number.int({ min: 1, max: 3 });
        }
        
        return faker.helpers.arrayElements(this.hobbyOptions, count);
    }

    /**
     * Gets the picture file path
     * Always returns the same avatar path from fixtures
     * @returns {string} Picture file path
     */
    getPicturePath() {
        return this.picturePath;
    }

    /**
     * Gets just the filename from the picture path
     * @returns {string} Picture filename
     */
    getPictureFilename() {
        return this.picturePath.split('/').pop();
    }

    /**
     * Generates a random current address
     * @returns {string} Current address
     */
    generateCurrentAddress() {
        return faker.location.streetAddress({ useFullAddress: true });
    }

    /**
     * Generates a random state
     * @returns {string} State name
     */
    generateState() {
        return faker.helpers.arrayElement(Object.keys(this.stateAndCityMapping));
    }

    /**
     * Generates a random city based on the state
     * @param {string} state - State name
     * @returns {string} City name
     */
    generateCity(state) {
        if (!this.stateAndCityMapping[state]) {
            throw new Error(`Invalid state: ${state}. Must be one of: ${Object.keys(this.stateAndCityMapping).join(', ')}`);
        }
        
        return faker.helpers.arrayElement(this.stateAndCityMapping[state]);
    }

    /**
     * Generates a random state and city pair
     * @returns {object} Object with state and city
     */
    generateStateAndCity() {
        const state = this.generateState();
        const city = this.generateCity(state);
        
        return { state, city };
    }

    /**
     * Generates complete form data with all fields
     * @param {object} overrides - Optional overrides for specific fields
     * @returns {object} Complete form data
     */
    generateAllFields(overrides = {}) {
        const dateOfBirth = this.generateDateOfBirth();
        const stateAndCity = this.generateStateAndCity();
        
        const defaultData = {
            firstName: this.generateFirstName(),
            lastName: this.generateLastName(),
            email: this.generateEmail(),
            gender: this.generateGender(),
            mobile: this.generateMobile(),
            dateOfBirth: dateOfBirth,
            subjects: this.generateSubjects(),
            hobbies: this.generateHobbies(),
            picture: this.getPicturePath(),
            currentAddress: this.generateCurrentAddress(),
            state: stateAndCity.state,
            city: stateAndCity.city
        };
        
        return { ...defaultData, ...overrides };
    }

    /**
     * Generates only mandatory form data (First Name, Last Name, Gender, Mobile)
     * @param {object} overrides - Optional overrides for specific fields
     * @returns {object} Mandatory form data
     */
    generateMandatoryFields(overrides = {}) {
        const defaultData = {
            firstName: this.generateFirstName(),
            lastName: this.generateLastName(),
            gender: this.generateGender(),
            mobile: this.generateMobile()
        };
        
        return { ...defaultData, ...overrides };
    }

    /**
     * Generates a specific gender
     * @param {string} gender - Gender to use ('Male', 'Female', or 'Other')
     * @returns {string} Gender
     */
    setGender(gender) {
        if (!this.genderOptions.includes(gender)) {
            throw new Error(`Invalid gender: ${gender}. Must be one of: ${this.genderOptions.join(', ')}`);
        }
        return gender;
    }

    /**
     * Generates data for multiple students
     * @param {number} count - Number of students to generate
     * @param {boolean} allFields - Whether to generate all fields (default: true)
     * @returns {object[]} Array of student data objects
     */
    generateMultipleStudents(count, allFields = true) {
        const students = [];
        
        for (let i = 0; i < count; i++) {
            students.push(
                allFields ? this.generateAllFields() : this.generateMandatoryFields()
            );
        }
        
        return students;
    }

    /**
     * Validates that generated mobile number is 10 digits
     * @param {string} mobile - Mobile number to validate
     * @returns {boolean} True if valid
     */
    isValidMobile(mobile) {
        return /^\d{10}$/.test(mobile);
    }

    /**
     * Validates that email is in correct format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Gets all available subjects
     * @returns {string[]} Array of all subjects
     */
    getAvailableSubjects() {
        return [...this.subjectOptions];
    }

    /**
     * Gets all available hobbies
     * @returns {string[]} Array of all hobbies
     */
    getAvailableHobbies() {
        return [...this.hobbyOptions];
    }

    /**
     * Gets all available states
     * @returns {string[]} Array of all states
     */
    getAvailableStates() {
        return Object.keys(this.stateAndCityMapping);
    }

    /**
     * Gets all cities for a specific state
     * @param {string} state - State name
     * @returns {string[]} Array of cities
     */
    getCitiesForState(state) {
        return this.stateAndCityMapping[state] || [];
    }

    /**
     * Gets all genders
     * @returns {string[]} Array of all genders
     */
    getAvailableGenders() {
        return [...this.genderOptions];
    }

    /**
     * Creates a data object with custom faker seed for reproducibility
     * @param {number} seed - Seed value for faker
     * @param {boolean} allFields - Whether to generate all fields (default: true)
     * @returns {object} Form data
     */
    generateWithSeed(seed, allFields = true) {
        faker.seed(seed);
        return allFields ? this.generateAllFields() : this.generateMandatoryFields();
    }

    logGeneratedData(data) {
        console.log('Generated Form Data:', data);
    }
}

// Export as singleton instance
const practiceFormDataProvider = new PracticeFormDataProvider();

module.exports = practiceFormDataProvider;

// Also export the class for advanced use cases
module.exports.PracticeFormDataProvider = PracticeFormDataProvider;

