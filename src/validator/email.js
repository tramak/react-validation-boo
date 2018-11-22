import Validator from './validator';

export default class Email extends Validator {
    validate(name, value, params) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(value)) {
            let error = params.error || this.translate('%value% is not a valid email address.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}