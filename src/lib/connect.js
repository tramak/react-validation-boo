import React from 'react';
import ProviderForm from '../components/provider-form';

export default function connect(params) {
    return function(component) {
        return React.createFactory(props => {
            return React.createElement(ProviderForm, {
                component,
                params,
                propsComponent: props
            });
        });
    };
}
