import React, {Component} from 'react';

class InputRadio extends Component {
    componentDidMount() {
        this.props.vBoo.mountRadio(this.props.value, this.props.checked);
    };
    componentWillUnmount() {
        this.props.vBoo.unMount();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.checked !== nextProps.checked && nextProps.checked) {
            this.props.vBoo.change(nextProps.checked ? nextProps.value: '');
        }
    }
    change = (event) => {
        let elem = event.target;

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        if(elem.checked) {
            this.props.vBoo.change(elem.value);
        }
    };
    render() {
        return (
            <input {...this.props} onChange={this.change} type="radio" />
        )
    }
}

export default InputRadio;