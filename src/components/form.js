import React, {Component} from 'react';

export default class Form extends Component {
    render() {
        return (
            <form {...this.props}>
                {this.props.connect(this.props.children)}
            </form>
        );
    }
}