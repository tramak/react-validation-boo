import React, {Component, PureComponent} from 'react';
import constants from '../constants';

export default class Form extends Component {
    render() {
        this.props.connect(this.props.children);

        return (
            <form {...this.props}>
                {this.props.children}
            </form>
        );
    }
}