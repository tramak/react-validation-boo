import React, {Component} from 'react';
import constants from '../constants';

class Input extends Component {
    componentDidMount() {
        this.props.vBoo.mount(this.props.value);
    }
    componentWillUnmount() {
        this.props.vBoo.unMount();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value) {
            this.props.vBoo.change(nextProps.value);
        }
    }
    change = (event) => {
        let val = event.target.value;

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.change(val);
    };
    blur = (event) => {
        let val = event.target.value;

        if(this.props.onBlur) {
            this.props.onBlur(event);
        }

        this.props.vBoo.change(val, constants.EVENT_BLUR);
    };
    render() {
        return (
            <input {...this.props} onChange={this.change} onBlur={this.blur} />
        )
    }
}

export default Input;