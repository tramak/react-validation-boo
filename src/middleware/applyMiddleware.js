import compose from '../lib/compose';

export default function applyMiddleware(...middlewares) {
    return (...args) => {
        return compose(...middlewares)(...args);
    };
}