import React, {Component} from 'react';
import constants from '../constants';

class Select extends Component {
    componentWillMount() {
        this.cloneProps = Object.assign({}, this.props);

        if(typeof(this.cloneProps.onChange) !== 'undefined') {
            delete(this.cloneProps.onChange);
        }

        this.setState({
            value: this.__getInitValue()
        })
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
        let value = this.__getInitValue();
        this.setState({value: value});
        this.props.vBoo.mount(value);
    };
    change = (event) => {
        let select = event.currentTarget;
        let val;

        if(select.multiple) {
            val = this.__getValueMultiple(select);
        } else {
            val = event.target.value;
        }

        this.setState({value: val});

        if(this.props.onChange) {
            this.props.onChange(event);
        }

        this.props.vBoo.change(val, constants.EVENT_BLUR);
    };
    __getInitValue() {
        let multiple = this.cloneProps.multiple;
        let val;

        if(multiple) {
            val = [];
        } else {
            val = '';
        }

        React.Children.forEach(this.cloneProps.children, item => {
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
            <select {...this.cloneProps} onChange={this.change} value={this.state.value}>
                {this.cloneProps.children}
            </select>
        )
    }
}

export default Select;