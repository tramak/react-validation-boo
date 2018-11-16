export default (fn, time) => {
    let timeout;

    return function (...args) {
        const functionCall = () => {
            fn.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}