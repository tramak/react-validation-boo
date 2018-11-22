import Validator from './validator';

export default class Compare extends Validator {
    validate(name, value, params) {
        if(!params.hasOwnProperty('compareAttribute')) {
            throw new Error('Missing required arguments: compareAttribute');
        }

        let compare = this.getField(params.compareAttribute);
        if(value !== compare.value) {
            let error = params.error || this.translate('%name% must be equal to %compareAttribute%');
            error = error.replace('%name%', name);
            error = error.replace('%compareAttribute%', this.getLabel(params.compareAttribute));
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}