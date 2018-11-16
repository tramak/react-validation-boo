import React, {Component} from 'react';
import constants from '../constants';

class InputCheckbox extends Component {
    componentWillMount() {
        this.cloneProps = Object.assign({}, this.props);
        this.cloneProps.type = 'checkbox';

        if(typeof(this.cloneProps.checked) !== 'undefined') {
            delete(this.cloneProps.checked);
        }

        if(typeof(this.cloneProps.onChange) !== 'undefined') {
            delete(this.cloneProps.onChange);
        }

        this.setState({checked: this.props.checked});
    }
    componentDidMount() {
        this.props.vBoo.changeCheckbox(this.state.checked ? this.props.value: '');
        this.props.vBoo.subscribe('reset', this.reset);
    };
    componentWillUnmount() {
        this.props.vBoo.unbscribe('reset', this.reset);
        this.props.vBoo.unMount();
    }
    reset = () => {
        this.setState({checked: this.props.checked});
        this.props.vBoo.changeCheckbox(this.state.checked ? this.props.value: '');
    };
    change = (event) => {
        this.setState({
            checked: !this.state.checked
        });

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.changeCheckbox(!this.state.checked ? this.props.value: '');
    };
    render() {
        return (
            <input {...this.cloneProps} onChange={this.change} checked={this.state.checked} />
        )
    }
}

export default InputCheckbox;