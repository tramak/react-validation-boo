import Validator from './validator';

export default class StringLength extends Validator {
    validate(name, value, params) {
        if(typeof(value) === 'undefined') {
            value = '';
        }

        if(params.plural) {
            value = params.plural(value);
        }

        if(params.hasOwnProperty('min') && value.length < params.min) {
            let error = params.errorMin || this.translate('The minimum number of characters must exceed %min%');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            error = error.replace('%min%', params.min);
            this.addError(error);
            return false;
        }

        if(params.hasOwnProperty('max') && value.length > params.max) {
            let error = params.errorMax || this.translate('The number of characters must not exceed %max%');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            error = error.replace('%max%', params.max);
            this.addError(error);
            return false;
        }
    }
}