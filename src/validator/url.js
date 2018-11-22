import Validator from './validator';

export default class Url extends Validator {
    validate(name, value, params) {
        let pattern = new RegExp('^(https?:\/\/)?'+ // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
            '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
            '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
            '(\#[-a-z\d_]*)?$','i'); // fragment locater
        if(typeof(value) === 'undefined' || !pattern.test(value)) {
            let error = params.error || this.translate('%value% is not a valid URL.');
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}