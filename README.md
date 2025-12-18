# Cypress Test Automation Project

## Project Overview

This project contains an automated test suite for the DemoQA web application (https://demoqa.com) using Cypress as the test automation framework. The test suite implements the Page Object Model (POM) design pattern and includes comprehensive end-to-end test scenarios for form submission and book management functionalities.

## Project Information

- **Project Name:** cypress-demoqa-tests
- **Version:** 1.0.0
- **Description:** Cypress test automation for demoqa.com
- **Test Framework:** Cypress v15.8.0
- **Target Application:** https://demoqa.com

## Project Structure

```
Cypress/
├── cypress/
│   ├── components/
│   │   └── calendar.js
│   ├── core/
│   │   ├── api/
│   │   │   └── apiClient.js
│   │   ├── elements/
│   │   │   ├── alert.js
│   │   │   └── objectWrapper.js
│   │   └── shared/
│   │       └── dataStorage.js
│   ├── downloads/
│   ├── e2e/
│   │   ├── scenario1.1-practice-form-all-fields.cy.js
│   │   ├── scenario1.2-practice-form-mandatory-fields.cy.js
│   │   └── scenario3-delete-book.cy.js
│   ├── fixtures/
│   │   ├── assets/
│   │   │   └── avatar.png
│   │   ├── books/
│   │   │   └── bookData.json
│   │   └── credentials/
│   │       └── userCredentials.json
│   ├── providers/
│   │   └── PracticeFormDataProvider.js
│   ├── reports/
│   ├── screenshots/
│   └── support/
│       ├── commands.js
│       ├── e2e.js
│       └── pages/
│           ├── BookDeletedPopup.js
│           ├── BookStorePage.js
│           ├── LoginPage.js
│           ├── PracticeFormPage.js
│           ├── ProfilePage.js
│           └── RegisterPopup.js
├── cypress.config.js
├── package.json
└── .gitignore
```

## Test Scenarios

### Scenario 1.1: Register Student Form with All Fields

**Objective:** Validate successful student registration when all form fields are populated.

**Test Coverage:**
- Navigation to practice form page
- Population of all available form fields including:
  - Personal information (First Name, Last Name, Email)
  - Gender selection
  - Mobile number
  - Date of birth
  - Subjects selection
  - Hobbies selection
  - Picture upload
  - Current address
  - State and city selection
- Form submission
- Verification of registration success popup
- Validation of all submitted data in the confirmation modal

### Scenario 1.2: Register Student Form with Mandatory Fields

**Objective:** Validate successful student registration when only mandatory fields are populated.

**Test Coverage:**
- Navigation to practice form page
- Population of mandatory fields only:
  - First Name
  - Last Name
  - Gender
  - Mobile number
- Form submission
- Verification of registration success popup
- Validation of mandatory data in the confirmation modal

### Scenario 3: Delete Book Successfully

**Objective:** Validate the complete book deletion workflow including authentication and verification.

**Test Coverage:**
- API token generation for authentication
- Pre-test data setup (clearing existing books and adding test book via API)
- User login via UI
- Profile page verification
- Book search functionality
- Book deletion operation
- Alert handling for deletion confirmation
- Verification that the book is removed from the collection

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. Clone the repository or navigate to the project directory:

```bash
cd Cypress
```

2. Install project dependencies:

```bash
npm install
```

3. Configure test credentials and data:
   - Update `cypress/fixtures/credentials/userCredentials.json` with valid credentials
   - Verify book data in `cypress/fixtures/books/bookData.json`

## Configuration

### Cypress Configuration

The project uses the following Cypress configuration settings defined in `cypress.config.js`:

- **Base URL:** https://demoqa.com
- **Viewport:** 1920x1080
- **Video Recording:** Disabled
- **Screenshot on Failure:** Enabled
- **Command Timeout:** 15000ms
- **Request Timeout:** 15000ms
- **Response Timeout:** 15000ms
- **Page Load Timeout:** 60000ms
- **Chrome Web Security:** Disabled
- **Experimental Memory Management:** Enabled

### Reporter Configuration

The project uses Mochawesome reporter with the following settings:
- Report directory: `cypress/reports`
- Output format: JSON (for merge operations)
- Timestamp format: mmddyyyy_HHMMss

### Browser Launch Arguments

The configuration includes specific browser launch arguments to:
- Disable site isolation features for improved test stability
- Disable HTTP cache in Electron browser
- Prevent browser crashes from third-party scripts

### Global Setup

The `cypress/support/e2e.js` file includes:
- Automatic blocking of advertising and tracking domains
- Custom CSS to hide request logs for cleaner command log
- Uncaught exception handling for cross-origin scripts and common errors
- Mochawesome reporter registration

## Running Tests

### Available Test Commands

The project includes several npm scripts for different test execution modes:

#### Open Cypress Test Runner (Interactive Mode)

```bash
npm run test:open
```

Opens the Cypress Test Runner GUI for interactive test development and debugging.

#### Run All Tests (Headless Mode)

```bash
npm test
```

or

```bash
npm run test:headless
```

Executes all tests in headless mode without UI.

#### Run Tests with Browser Visible (Headed Mode)

```bash
npm run test:headed
```

Executes all tests with the browser window visible.

#### Run Tests with Report Generation

```bash
npm run test:report
```

Executes all tests and generates a consolidated HTML report.

### Individual Test Commands

To run a specific test file:

```bash
npx cypress run --spec "cypress/e2e/scenario1.1-practice-form-all-fields.cy.js"
```

## Reporting

### Report Generation Process

The project uses Mochawesome for test reporting with the following workflow:

1. **Test Execution:** Each test run generates individual JSON report files in `cypress/reports/`

2. **Report Merging:**

```bash
npm run merge-reports
```

Merges all individual JSON reports into a single `merged-report.json` file.

3. **HTML Report Generation:**

```bash
npm run generate-report
```

Converts the merged JSON report into an HTML report with inline assets.

4. **Clean Reports:**

```bash
npm run clean-reports
```

Removes all existing reports and recreates the reports directory.

### Report Location

Generated reports are located in:
- **JSON Reports:** `cypress/reports/*.json`
- **Merged Report:** `cypress/reports/merged-report.json`
- **HTML Report:** `cypress/reports/index.html`

## Dependencies

### Development Dependencies

- **cypress** (^15.8.0): End-to-end testing framework
- **cypress-mochawesome-reporter** (^3.7.0): Mochawesome reporter plugin for Cypress
- **cypress-xpath** (^2.0.1): XPath selector support for Cypress
- **mochawesome** (^7.1.3): Test reporter for generating attractive HTML/CSS reports
- **mochawesome-merge** (^4.3.0): Utility to merge multiple mochawesome JSON reports
- **mochawesome-report-generator** (^6.2.0): Generates HTML reports from mochawesome JSON

### Production Dependencies

- **@faker-js/faker** (^10.1.0): Library for generating fake data for test scenarios
- **axios** (^1.13.2): Promise-based HTTP client for API requests
- **crypto-js** (^4.2.0): JavaScript library for cryptographic operations

## Architecture

### Page Object Model (POM)

The project implements the Page Object Model design pattern with the following page objects:

- **LoginPage:** Handles login functionality and authentication
- **ProfilePage:** Manages user profile page interactions and book operations
- **PracticeFormPage:** Handles student registration form interactions
- **RegisterPopup:** Manages registration confirmation popup verification
- **BookStorePage:** Handles book store page operations
- **BookDeletedPopup:** Manages book deletion confirmation popup

### Data Providers

- **PracticeFormDataProvider:** Generates random test data for form submission scenarios using Faker.js

### Core Components

- **apiClient.js:** Centralized API request handling
- **alert.js:** Alert handling utilities
- **objectWrapper.js:** Element wrapper for consistent interaction patterns
- **dataStorage.js:** Test data storage and management
- **calendar.js:** Calendar component interaction utilities

### Fixtures

Test data is organized in the fixtures directory:
- **credentials/userCredentials.json:** User authentication credentials
- **books/bookData.json:** Book information for test scenarios
- **assets/avatar.png:** Image file for upload testing

## Best Practices Implemented

### Code Organization

- Separation of concerns through Page Object Model
- Reusable components and utilities in core directory
- Centralized test data management through fixtures and providers

### Test Design

- Clear test scenario naming conventions
- Comprehensive assertions and verifications
- Data-driven testing using Faker.js for dynamic test data
- API integration for test data setup and cleanup

### Error Handling

- Graceful handling of uncaught exceptions from third-party scripts
- Blocking of advertising and tracking scripts to prevent test interference
- Screenshot capture on test failures for debugging

### Performance Optimization

- Experimental memory management enabled
- Request/XHR logging hidden from command log
- Video recording disabled by default
- Strategic use of API calls for test setup to reduce execution time

### Maintainability

- Consistent coding style and structure
- Meaningful variable and function names
- Modular and reusable code components
- Comprehensive configuration management

## Continuous Integration Considerations

For CI/CD integration, the following configurations are recommended:

- Use `npm run test:headless` for pipeline execution
- Enable video recording for failed tests by modifying `cypress.config.js`
- Archive test reports and screenshots as build artifacts
- Consider parallel test execution for faster feedback

## Troubleshooting

### Common Issues

**Issue:** Browser crashes during test execution
**Solution:** The project includes ad-blocking configuration in `cypress/support/e2e.js` to prevent third-party script interference.

**Issue:** Test timeouts
**Solution:** Timeout values are configured in `cypress.config.js` and can be adjusted based on network conditions.

**Issue:** Authentication failures
**Solution:** Verify credentials in `cypress/fixtures/credentials/userCredentials.json` are valid and up-to-date.

## Version Control

The project includes a `.gitignore` file that excludes:
- Node modules
- Test reports and artifacts
- Screenshots and videos
- IDE-specific files
- System files

## Contributing

When contributing to this project, please ensure:
- All new tests follow the existing Page Object Model structure
- Test data is managed through fixtures or data providers
- Code follows the established naming conventions and style
- All tests pass before submitting changes

## Support and Documentation

For additional information about Cypress framework:
- Official Documentation: https://docs.cypress.io
- API Reference: https://docs.cypress.io/api/table-of-contents
- Best Practices: https://docs.cypress.io/guides/references/best-practices

---

**Last Updated:** December 2025

