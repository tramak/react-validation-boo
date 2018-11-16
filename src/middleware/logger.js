function logger(event, params) {
    return (next) => {
        console.log('validation logger: ', params);
        return next(event, params);
    }
}

export default logger;