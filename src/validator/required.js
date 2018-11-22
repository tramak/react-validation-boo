import Validator from './validator';

export default class Required extends Validator {
    validate(name, value, params) {
        if(!(typeof(value) !== 'undefined' && value !== '')) {
            let error = params.error || this.translate('%name% must be required.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}