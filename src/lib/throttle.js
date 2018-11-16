export default (fn, time) => {
    let timeout;
    let lastCall = 0;

    return function (...args) {
        const now = (new Date).getTime();
        const functionCall = () => {
            fn.apply(this, args);
        };

        clearTimeout(timeout);
        if (now - lastCall < time) {
            timeout = setTimeout(functionCall, time);
            return;
        }

        lastCall = now;
        return functionCall();
    }
}