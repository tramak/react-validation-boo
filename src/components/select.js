import React, {Component} from 'react';
import constants from '../constants';

class Select extends Component {
    componentDidMount() {
        let value = this.props.value || this.__getInitValue();
        this.props.vBoo.mount(value);
    }
    componentWillUnmount() {
        this.props.vBoo.unMount();
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value) {
            this.props.vBoo.change(nextProps.value, constants.EVENT_BLUR);
        }
    }
    change = (event) => {
        let select = event.currentTarget;
        let val;

        if(select.multiple) {
            val = this.__getValueMultiple(select);
        } else {
            val = event.target.value;
        }

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.change(val, constants.EVENT_BLUR);
    };
    __getInitValue() {
        let multiple = this.props.multiple;
        let val;

        if(multiple) {
            val = [];
        } else {
            val = '';
        }

        React.Children.forEach(this.props.children, item => {
            if(!item.props) return;

            if(item.props.selected) {
                if(multiple) {
                    val.push(item.props.value);
                } else {
                    val = item.props.value;
                }
            }
        });

        return val;
    }
    __getValueMultiple(select) {
        return [].slice.call(select.options).reduce((result, option) => {
            if(option.selected) result.push(option.value);
            return result;
        }, []);
    }
    render() {
        return (
            <select {...this.props} onChange={this.change}>
                {this.props.children}
            </select>
        )
    }
}

export default Select;