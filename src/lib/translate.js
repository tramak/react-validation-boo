import ru from '../messages/ru';

export default (message, lang) => {
    let messages = {};
    if (lang === 'ru') {
        messages = ru;
    }

    if(typeof(messages[message]) !== 'undefined') {
        return messages[message];
    }

    return message;
}