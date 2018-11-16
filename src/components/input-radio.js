import React, {Component} from 'react';
import constants from '../constants';

class InputRadio extends Component {
    componentWillMount() {
        this.cloneProps = Object.assign({}, this.props);
        this.cloneProps.type = 'radio';

        if(typeof(this.cloneProps.onChange) !== 'undefined') {
            delete(this.cloneProps.onChange);
        }
    }
    componentDidMount() {
        this.props.vBoo.changeRadio(this.props.value, this.props.checked, constants.EVENT_INIT);
        this.props.vBoo.subscribe('reset', this.reset);
    };
    componentWillUnmount() {
        this.props.vBoo.unsubscribe('reset', this.reset);
        this.props.vBoo.unMount();
    }
    reset = () => {
        this.props.vBoo.changeRadio(this.props.value, this.props.checked, constants.EVENT_INIT);
    };
    change = (event) => {
        let val = event.target.value;

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.changeRadio(val, true);
    };
    isChecked() {
        return this.props.vBoo.isCheckedRadio(this.cloneProps.value);
    }
    render() {
        return (
            <input {...this.cloneProps} onChange={this.change} checked={this.isChecked()} />
        )
    }
}

export default InputRadio;