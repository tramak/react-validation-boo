import React, {Component} from 'react';
import constants from '../constants';
import validator from '../validator';
import debounce from '../lib/debounce';
import throttle from '../lib/throttle';
import intersection from '../lib/intersection';
import Observer from '../lib/observer';

export default class ProviderForm extends Component {
    constructor() {
        super();

        /**
         * __field = {
         *      name: {
         *          value,
         *          isValid,
         *          activeScenario,
         *          error,
         *          type: (EVENT_INIT|EVENT_CHANGE|EVENT_CHANGE_VALIDATE|EVENT_BLUR),
         *          typeInput: (TYPE_INPUT, TYPE_RADIO, TYPE_CHECKBOX)
         *      }
         * }
         */
        this.scenario = 'default';
        this.__fields = {};
        this.__labels = {};
        this.__observer = new Observer();
        this.state = {};
    }
    componentWillMount() {
        let {rules, labels, middleware, validators = {}, delay = 700, lang='en'} = this.props.params;
        if(!rules) return;
        if(typeof(rules) !== 'function') throw "Uncaught TypeError: rules is not a function";

        this.__rules = this.__initRules(rules());
        if(!(this.__rules instanceof Array)) throw "Uncaught TypeError: rules is not result a Array";

        this.__rules.forEach(item => {
            if (!(item instanceof Array) || typeof(item[0]) === "undefined") {
                throw "Uncaught TypeError: rules is not result items a Array";
            }
        });

        if(labels) {
            if(typeof(labels) !== 'function') throw "Uncaught TypeError: rules is not a function";
            this.__labels = labels();
        }

        if(typeof(middleware) === 'function') {
            this.__middleware = middleware;
        }

        this.lang = lang;
        this.validators = Object.assign({}, validator, validators);

        this.__debounceVaidate = debounce(this.__validate, delay);
        this.__throttleVaidate = throttle(this.__validate, delay);
    };
    mount = (name, value) => {
        let type = constants.EVENT_INIT;
        this.__initField(name, value, type);
        this.__fields[name].type = type;
        this.__change(name, value, type);
    };
    unMount = (name) => {
        if(this.__fields[name]) {
            delete(this.__fields[name]);

            this.setState((state) => {
                let newState = Object.assign({}, state);
                delete(newState[name]);
                return newState;
            });
        }
    };
    __initField(name, value, type) {
        if(!this.__fields[name]) this.__fields[name] = {
            value: value,
            isValid: false,
            activeScenario: false,
            type: type,
            typeInput: constants.TYPE_INPUT
        };
    }
    change = (name, value, type = constants.EVENT_CHANGE) => {
        this.__observer.publish('change:input', {
            name, value
        });
        this.__initField(name, value, type);
        this.__change(name, value, type);
    };
    __change(name, value, type) {
        this.__fields[name].value = value;

        if(this.__fields[name].type < type) {
            this.__fields[name].type = type;
        }

        if(type === constants.EVENT_BLUR || type === constants.EVENT_INIT) {
            this.__validate(name, value);
        } else {
            if(typeof(this.__fields[name].error) !== 'undefined') {
                this.__throttleVaidate(name, value);
            } else {
                this.__debounceVaidate(name, value);
            }
        }
    };
    changeRadio = (name, value, checked = false, type = constants.EVENT_CHANGE) => {
        if (!this.__fields[name]) {
            this.__fields[name] = {
                isValid: false,
                type: type,
                typeInput: constants.TYPE_RADIO
            };

            if(!checked) {
                this.__validate(name, '');
            }
        }

        if(checked) {
            this.__observer.publish('change:input', {
                name, value
            });

            if(type === constants.EVENT_INIT) {
                this.__fields[name].type = type;
            }
            this.__fields[name].value = value;
            this.__validate(name, value);
        }
    };
    isCheckedRadio = (name, value) => {
        return this.__fields.hasOwnProperty(name)
            && this.__fields[name].hasOwnProperty('value')
            && this.__fields[name].value === value;
    };
    changeCheckbox = (name, value) => {
        this.__observer.publish('change:input', {
            name, value
        });

        if (!this.__fields[name]) {
            this.__fields[name] = {
                isValid: false,
                type: constants.EVENT_INIT,
                typeInput: constants.TYPE_CHECKBOX
            };
        } else {
            this.__fields[name].type = constants.EVENT_BLUR;
        }

        this.__fields[name].value = value;
        this.__validate(name, value);
    };
    addError = (name, error) => {
        this.__fields[name].error = error;
        this.__fields[name].isValid = false;

        this.setState((state) => {
            let newState = Object.assign({}, state);
            newState[name] = {
                error: error
            };
            return newState;
        });
    };
    deleteError = (name) => {
        this.__fields[name].isValid = true;

        if(typeof(this.__fields[name].error) !== 'undefined') {
            delete(this.__fields[name].error);
            this.setState((state) => {
                let newState = Object.assign({}, state);
                newState[name] = {
                    error: false
                };
                return newState;
            });
        }

        if(this.__fields[name].typeInput === constants.TYPE_RADIO) {
            this.forceUpdate();
        }
    };
    hasError = (name) => {
        let isError = this.__fields.hasOwnProperty(name)
            && this.__fields[name].type > constants.EVENT_CHANGE
            && this.__fields[name].hasOwnProperty('error');

        return isError;
    };
    getError = (name) => {
        let error = this.__fields.hasOwnProperty(name)
            && this.__fields[name].type > constants.EVENT_CHANGE
            && this.__fields[name].error;

        return error;
    };
    getErrors = () => {
        let values = {};
        Object.entries(this.__fields).forEach(([name, item]) => {
            if(item.hasOwnProperty('error')) {
                values[name] = item.error;
            }
        });

        return values;
    };
    showErrors = (name) => {
        if(typeof(name) === 'undefined') {
            Object.entries(this.__fields).forEach(([name, item]) => {
                if (item.hasOwnProperty('error')) {
                    item.type = constants.EVENT_BLUR;
                }
            });
        } else {
            if(this.__fields.hasOwnProperty(name)) {
                this.__fields[name].type = constants.EVENT_BLUR;
            }
        }

        this.setState(Object.assign({}, this.state));
    };
    getValues = (all = false) => {
        let values = {};
        Object.entries(this.__fields).forEach(([name, item]) => {
            if(all || item.activeScenario) {
                values[name] = item.value;
            }
        });

        return values;
    };
    getLabel = (name) => {
        return this.__labels[name] || name;
    };
    setScenario = (scenario, forceUpdate=true) => {
        if(this.scenario !== scenario) {
            this.scenario = scenario;
            this.__forceValidate();
            forceUpdate && this.forceUpdate();
        }
    };
    getScenario = () => {
        return this.scenario;
    };
    hasScenario = (scenario) => {
        return (typeof(this.scenario) === 'string' && this.scenario === scenario
        || this.scenario instanceof Array && this.scenario.indexOf(scenario) !== -1);
    };
    isValid = (name) => {
        if(typeof(name) !== 'undefined') {
            return this.__isValidItem(name);
        }

        return this.__isValidForm();
    };
    reset = () => {
        this.__clearPromiseValidate();

        Object.entries(this.__fields).forEach(([name, item]) => {
            this.__fields[name].isValid = false;
            this.__fields[name].type = constants.EVENT_INIT;
            delete(this.__fields[name].error);
        });

        this.setScenario('default');

        this.__observer.publish('reset:before');
        this.__observer.publish('reset');
        this.__observer.publish('reset:after');
    };
    __clearPromiseValidate() {
        this.__throttleVaidate(false);
        this.__debounceVaidate(false);
    }
    __isValidForm() {
        return Object.entries(this.__fields).every(([name, item]) => {
            return item.activeScenario && item.isValid;
        });
    }
    __isValidItem(name) {
        return this.__fields.hasOwnProperty(name) && this.__fields[name].isValid;
    };
    __initRules(rules) {
        rules.forEach(item => item[2] = item[2] || {});

        return rules;
    };
    __connectInput = (children) => {
        React.Children.forEach(children, item => {
            if(!item.props) return;

            if(item.props.name && this.__issetNameRules(item.props.name)) {
                let name = item.props.name;
                item.props.vBoo = {
                    mount: (value) => this.mount(name, value),
                    unMount: () => this.unMount(name),
                    change: (value, type) => this.change(name, value, type),
                    changeRadio: (value, checked, type) => this.changeRadio(name, value, checked, type),
                    isCheckedRadio: (value) => this.isCheckedRadio(name, value),
                    changeCheckbox: (value) => this.changeCheckbox(name, value),
                    getLabel: () => this.getLabel(name),
                    getError: () => this.getError(name),
                    hasError: () => this.hasError(name),
                    subscribe: (event, func) => this.__observer.subscribe(event, func),
                    unsubscribe: (event, func) => this.__observer.unsubscribe(event, func)
                };
            }

            if(item.props.children) {
                this.__connectInput(item.props.children);
            }
        });
    };
    __issetNameRules(name) {
        return this.__rules.find(item => {
            if(typeof(item[0]) === 'string') return item[0] === name;
            if(item[0] instanceof Array) return item[0].indexOf(name) !== -1;
        });
    }
    __isRuleActive(name, rule) {
        if(rule[2].hasOwnProperty('scenario')) {
            let scenario = rule[2].scenario instanceof Array ? rule[2].scenario : [rule[2].scenario];
            let scenarioForm = this.scenario instanceof Array ? this.scenario : [this.scenario];

            if(!intersection(scenario, scenarioForm).length) return false;
        }

        return typeof(rule[0]) === 'string' && rule[0] === name
            || rule[0] instanceof Array && rule[0].indexOf(name) !== -1;
    }
    __validate(name, value) {
        if(name === false || !this.__fields.hasOwnProperty(name)) return;

        let result = this.__rules.every(item => {
            if(this.__isRuleActive(name, item)) {
                this.__fields[name].activeScenario = true;

                // делаем проверку на валидность
                let funcRules = this.validators[item[1]];
                if(typeof(funcRules) !== 'function') throw "Uncaught TypeError: rule is not a validator";

                let rulI = new funcRules();
                rulI.setLang(this.lang);
                rulI.validate(this.getLabel(name), value, item[2]);

                this.__middlewareCall(constants.MIDDLEWARE_VALIDATE_INPUT, {
                    name: name,
                    value: value,
                    rule: item[1],
                    valid: !rulI.hasError()
                });

                if(rulI.hasError()) {
                    this.addError(name, rulI.getError());
                    return false;
                }
            }

            return true;
        });

        if(result) {
            this.deleteError(name);

            if(this.__fields[name].type < constants.EVENT_CHANGE_VALIDATE) {
                this.__fields[name].type = constants.EVENT_CHANGE_VALIDATE;
            }
        }

        return result;
    }
    __forceValidate() {
        Object.entries(this.__fields).forEach(([name, item]) => {
            item.activeScenario = false;
            this.__validate(name, item.value);
        });
    }
    __middlewareCall(event, params) {
        if(typeof(this.__middleware) === 'function') {
            this.__middleware(event, params)(() => {});
        }
    }
    render() {
        return React.createElement(this.props.component, Object.assign({}, this.props.propsComponent, {
            vBoo: {
                connect: this.__connectInput,
                isValid: this.isValid,
                hasError: this.hasError,
                getError: this.getError,
                getErrors: this.getErrors,
                showErrors: this.showErrors,
                getLabel: this.getLabel,
                getValues: this.getValues,
                setScenario: this.setScenario,
                getScenario: this.getScenario,
                hasScenario: this.hasScenario,
                reset: this.reset,
                subscribe: (event, func) => this.__observer.subscribe(event, func),
                unsubscribe: (event, func) => this.__observer.unsubscribe(event, func)
            }
        }));
    }
}