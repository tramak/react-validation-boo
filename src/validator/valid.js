import validator from './validator';

class valid extends validator {
    validate(name, value, params) {
        return true;
    }
}

export default valid;