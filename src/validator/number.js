import Validator from './validator';

export default class Number extends Validator {
    validate(name, value, params) {
        if(typeof(value) === 'undefined' || !/^\d+$/.test(value)) {
            let error = params.error || this.translate('%value% must be a number.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}