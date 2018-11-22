import Validator from './validator';

export default class NotEmptyArray extends Validator {
    validate(name, arrayValues, params) {
        if(!(arrayValues instanceof Array) || arrayValues.length === 0) {
            let error = params.error || this.translate('%name% must be required.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', arrayValues.join(','));
            this.addError(error);
        }
    }
}