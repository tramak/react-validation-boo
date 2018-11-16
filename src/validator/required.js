import validator from './validator';

class required extends validator {
    validate(name, value, params) {
        if(!(typeof(value) !== 'undefined' && value !== '')) {
            let error = params.error || this.translate('%name% must be required.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}

export default required;