const WebObject = require('../core/elements/objectWrapper');

class Calendar {
    constructor() {
        this._monthSelectDropdown = new WebObject("select[class$='month-select']", "Month Select Dropdown");
        this._yearSelectDropdown = new WebObject("select[class$='year-select']", "Year Select Dropdown");
        
        this.months = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
    }

    selectDate(date) {
        const dateParts = date.split("/");
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
        
        return this.selectYear(year)
            .then(() => this.selectMonth(month))
            .then(() => this.selectDay(day));
    }

    selectYear(year) {
        return this._yearSelectDropdown.selectOptionFromElement(year);
    }

    selectMonth(month) {
        const monthIndex = parseInt(month) - 1;
        const monthName = this.months[monthIndex];
        
        return this._monthSelectDropdown.selectOptionFromElement(monthName);
    }

    selectDay(day) {
        const formattedDay = parseInt(day).toString();
        
        const dayElement = new WebObject(
            `//div[contains(@class, 'week')]/div[contains(@class, 'day') and not(contains(@class, 'outside-month')) and text()='${formattedDay}']`,
            "Day Cell"
        );
        
        return dayElement.click();
    }
}

module.exports = Calendar;

