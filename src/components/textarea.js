import React, {Component} from 'react';
import Input from './input';

class Textarea extends Input {
    componentWillMount() {
        this.setState({value: this.props.children || ''})
    }
    render() {
        return (
            <textarea
                {...this.cloneProps}
                value={this.state.value}
                onChange={this.change}
                onBlur={this.blur}>{this.props.children}</textarea>
        )
    }
}

export default Textarea;