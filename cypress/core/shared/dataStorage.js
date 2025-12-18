/**
 * DataStorage - A shared data storage utility for managing test data across Cypress tests
 * Mirrors the functionality of the .NET DataStorage implementation
 * Provides a centralized key-value store for sharing data within and across tests
 */
class DataStorage {
    constructor() {
        // Private storage using Map for better key handling
        this._storage = new Map();
    }

    /**
     * Initializes or reinitializes the storage
     * Clears any existing data and creates a fresh storage instance
     * @returns {void}
     */
    initStorage() {
        this._storage = new Map();
        cy.log('DataStorage: Storage initialized');
    }

    /**
     * Stores a value with the specified key
     * @param {string} key - The key to store the value under
     * @param {*} value - The value to store (can be any type: object, string, number, etc.)
     * @returns {void}
     */
    setData(key, value) {
        if (!key) {
            throw new Error('DataStorage: Key cannot be null or empty');
        }
        
        this._storage.set(key, value);
        cy.log(`DataStorage: Set data for key "${key}"`, value);
    }

    /**
     * Retrieves a value by key
     * @param {string} key - The key to retrieve the value for
     * @returns {*} The stored value, or null if key doesn't exist
     */
    getData(key) {
        if (!key) {
            cy.log('DataStorage: Key cannot be null or empty');
            return null;
        }

        if (!this._storage.has(key)) {
            cy.log(`DataStorage: Key "${key}" not found`);
            return null;
        }

        const value = this._storage.get(key);
        cy.log(`DataStorage: Retrieved data for key "${key}"`, value);
        return value;
    }

    /**
     * Clears all data from storage
     * @returns {void}
     */
    clearData() {
        if (this._storage) {
            const size = this._storage.size;
            this._storage.clear();
            cy.log(`DataStorage: Cleared storage (${size} item(s) removed)`);
        }
    }

    /**
     * Checks if a key exists in storage
     * @param {string} key - The key to check
     * @returns {boolean} True if key exists, false otherwise
     */
    hasKey(key) {
        if (!key) {
            return false;
        }
        return this._storage.has(key);
    }

    /**
     * Removes a specific key from storage
     * @param {string} key - The key to remove
     * @returns {boolean} True if key was removed, false if key didn't exist
     */
    removeData(key) {
        if (!key) {
            cy.log('DataStorage: Key cannot be null or empty');
            return false;
        }

        if (this._storage.has(key)) {
            this._storage.delete(key);
            cy.log(`DataStorage: Removed data for key "${key}"`);
            return true;
        }

        cy.log(`DataStorage: Key "${key}" not found, nothing to remove`);
        return false;
    }

    /**
     * Gets all keys currently in storage
     * @returns {string[]} Array of all keys
     */
    getAllKeys() {
        return Array.from(this._storage.keys());
    }

    /**
     * Gets all values currently in storage
     * @returns {Array<*>} Array of all values
     */
    getAllValues() {
        return Array.from(this._storage.values());
    }

    /**
     * Gets the number of items in storage
     * @returns {number} Number of stored items
     */
    getSize() {
        return this._storage.size;
    }

    /**
     * Checks if storage is empty
     * @returns {boolean} True if storage is empty, false otherwise
     */
    isEmpty() {
        return this._storage.size === 0;
    }

    /**
     * Gets all data as an object
     * @returns {object} Object containing all key-value pairs
     */
    getAllData() {
        const data = {};
        this._storage.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Sets multiple key-value pairs at once
     * @param {object} dataObject - Object containing key-value pairs to store
     * @returns {void}
     */
    setMultipleData(dataObject) {
        if (!dataObject || typeof dataObject !== 'object') {
            throw new Error('DataStorage: dataObject must be a valid object');
        }

        Object.keys(dataObject).forEach((key) => {
            this._storage.set(key, dataObject[key]);
        });

        cy.log(`DataStorage: Set multiple data (${Object.keys(dataObject).length} item(s))`);
    }

    /**
     * Gets data with a default value if key doesn't exist
     * @param {string} key - The key to retrieve
     * @param {*} defaultValue - The default value to return if key doesn't exist
     * @returns {*} The stored value or default value
     */
    getDataOrDefault(key, defaultValue = null) {
        if (!key) {
            return defaultValue;
        }

        if (!this._storage.has(key)) {
            cy.log(`DataStorage: Key "${key}" not found, returning default value`);
            return defaultValue;
        }

        return this._storage.get(key);
    }

    /**
     * Updates existing data or sets it if it doesn't exist
     * @param {string} key - The key to update
     * @param {function} updateFunction - Function that receives current value and returns new value
     * @returns {*} The new value
     */
    updateData(key, updateFunction) {
        if (!key) {
            throw new Error('DataStorage: Key cannot be null or empty');
        }

        if (typeof updateFunction !== 'function') {
            throw new Error('DataStorage: updateFunction must be a function');
        }

        const currentValue = this._storage.get(key);
        const newValue = updateFunction(currentValue);
        this._storage.set(key, newValue);
        
        cy.log(`DataStorage: Updated data for key "${key}"`);
        return newValue;
    }

    /**
     * Prints all storage contents to console (for debugging)
     * @returns {void}
     */
    printStorage() {
        if (this._storage.size === 0) {
            cy.log('DataStorage: Storage is empty');
            console.log('DataStorage: Storage is empty');
            return;
        }

        const data = this.getAllData();
        cy.log('DataStorage: Current storage contents', data);
        console.log('DataStorage: Current storage contents:', data);
    }
}

// Create a singleton instance
const dataStorageInstance = new DataStorage();

// Export both the class and singleton instance
// The singleton ensures data is shared across all usages
module.exports = dataStorageInstance;

// Also export the class for advanced use cases
module.exports.DataStorage = DataStorage;

