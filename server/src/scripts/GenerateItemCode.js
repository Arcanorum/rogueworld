const Utils = require("../Utils");

(() => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let code = "";
    code += Utils.getRandomElement(letters);
    code += Utils.getRandomElement(letters);
    code += Utils.getRandomElement(letters);
    code += Utils.getRandomElement(letters);
    code += Utils.getRandomElement(numbers);
    code += Utils.getRandomElement(numbers);
    code += Utils.getRandomElement(numbers);
    code += Utils.getRandomElement(numbers);

    Utils.message("Generated item code:");
    // eslint-disable-next-line no-console
    console.log(code);
})();
