import ru from '../messages/ru';

export default (message, lang) => {
    let messages = {};
    switch (lang) {
        case 'ru': messages = ru;
    }

    if(typeof(messages[message]) !== 'undefined') {
        return messages[message];
    }

    return message;
}