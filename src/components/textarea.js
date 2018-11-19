import React, {Component} from 'react';
import Input from './input';

class Textarea extends Input {
    render() {
        return (
            <textarea {...this.props} onChange={this.change} onBlur={this.blur} />
        );
    }
}

export default Textarea;