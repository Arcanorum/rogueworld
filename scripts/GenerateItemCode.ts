import { getRandomElement, message } from '@rogueworld/utils';

(() => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let code = '';
    code += getRandomElement(letters);
    code += getRandomElement(letters);
    code += getRandomElement(letters);
    code += getRandomElement(letters);
    code += getRandomElement(numbers);
    code += getRandomElement(numbers);
    code += getRandomElement(numbers);
    code += getRandomElement(numbers);

    message('Generated item code:');
    // eslint-disable-next-line no-console
    console.log(code);
})();
