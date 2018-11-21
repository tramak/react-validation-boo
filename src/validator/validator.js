import translate from '../lib/translate';

class validator {
    constructor() {
        this.__isError = false;
        this.__errorMessage = '';
        this.__lang = 'en';
        this.__fields = {};
        this.__labels = {};
    }
    setLang(lang) {
        this.__lang = lang;
    }
    getLang() {
        return this.__lang;
    }
    setFields(fields) {
        this.__fields = fields;
    }
    getField(name) {
        return this.__fields[name];
    }
    setLabels(labels) {
        this.__labels = labels;
    }
    getLabel(name) {
        return this.__labels[name] || name;
    }
    validate(name, value, params) {
        return true;
    }
    addError(error) {
        this.__isError = true;
        this.__errorMessage = error;
    }
    hasError() {
        return this.__isError;
    }
    getError() {
        return this.__errorMessage;
    }
    translate(message) {
        return translate(message, this.getLang());
    }
}

export default validator;