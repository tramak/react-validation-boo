import React, {Component} from 'react';
import constants from '../constants';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }
    componentWillMount() {
        this.cloneProps = Object.assign({}, this.props);

        if(typeof(this.cloneProps.value) !== 'undefined') {
            this.setState({value: this.cloneProps.value});
            delete(this.cloneProps.value);
        }

        if(typeof(this.cloneProps.onChange) !== 'undefined') {
            delete(this.cloneProps.onChange);
        }

        if(typeof(this.cloneProps.onBlur) !== 'undefined') {
            delete(this.cloneProps.onBlur);
        }
    }
    componentDidMount() {
        this.props.vBoo.mount(this.state.value);
        this.props.vBoo.subscribe('reset', this.reset);
    }
    componentWillUnmount() {
        this.props.vBoo.unsubscribe('reset', this.reset);
        this.props.vBoo.unMount();
    }
    reset = () => {
        let value = this.props.value || '';
        this.setState({value: value});
        this.props.vBoo.mount(value);
    };
    change = (event) => {
        let val = event.target.value;

        this.setState({value: val});

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
            <input {...this.cloneProps} value={this.state.value} onChange={this.change} onBlur={this.blur} />
        )
    }
}

export default Input;