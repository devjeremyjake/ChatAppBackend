module.exports = {
    // helper to help convert value to firstUpper(UpperCase) and lowerCase {used by auth.js}
    firstUpper: (username) => {
        const name = username.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },

    lowerCase: (str) => {
        return str.toLowerCase();
    },

}