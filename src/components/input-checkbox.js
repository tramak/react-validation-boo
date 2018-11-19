import React, {Component} from 'react';

class InputCheckbox extends Component {
    componentDidMount() {
        this.props.vBoo.mountCheckbox(this.props.checked ? this.props.value: '');
    };
    componentWillUnmount() {
        this.props.vBoo.unMount();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.checked !== nextProps.checked) {
            this.props.vBoo.change(nextProps.checked ? nextProps.value: '');
        }
    }
    change = (event) => {
        let elem = event.target;
        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.changeCheckbox(elem.checked ? this.props.value: '');
    };
    render() {
        return (
            <input {...this.props} onChange={this.change} type="checkbox" />
        )
    }
}

export default InputCheckbox;