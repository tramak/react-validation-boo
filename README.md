# react-validation-boo

Компонент для обеспечения проверки сложных динамических форм на React.

react-validation-boo предоставляет вам набор правил и компонентов для валидации форм.

## Примеры использования

Для начала создадим компонент и подключим к нему валидацию.

```javascript
import React, {Component} from 'react';
import {connect, Form, Input, logger} from 'react-validation-boo';

class MyForm extends Component {
    sendForm = (event) => {
        event.preventDefault();

        if(this.props.vBoo.isValid()) {
            console.log('Получаем введённые значения и отправляем их на сервер', this.props.vBoo.getValues());
        } else {
            console.log('Выведем в консоль ошибки', this.props.vBoo.getErrors());
        }
    };
    getError = (name) => {
        return this.props.vBoo.hasError(name) ? <div className="error">{this.props.vBoo.getError(name)}</div> : '';
    };
    render() {
        return <Form connect={this.props.vBoo.connect}>
            <div>
                <Input type="text" name="name" />
                {this.getError('name')}
            </div>
            
            <button onClick={this.sendForm}>
                {this.props.vBoo.isValid() ? 'Можно отправлять': 'Будьте внимательны!!!'}
            </button>
        </Form>
    }
}

export default connect({
    rules: () => (
        [
            ['name', 'required'],
        ]
    ),
    middleware: logger
})(MyForm);
```
Давайте разберём этот код.
Начнём с функции ```connect```, в неё мы передаём наши правила валидации и другие дополнительные параметры.
Вызвав этот метод мы получаем новую функцию в которую передаём наш компонент(```MyForm```),
чтобы он получил в ```props``` необходимые методы работы с валидацией форм. 

В функции ```render``` нашего компонента мы возвращаем компонент ```Form``` который соединяем с правилами валидации ```connect={this.props.connect}```
Эта необходимая конструкция для того чтобы ```Form``` знал как валидировать вложенные компоненты.

```Input``` &lt;Input type="text" name="name" /&gt; поле ввода которое мы будем проверять, правила проверки мы передали connect в свойстве ```rules```.
В нашем случае это ```name``` не должно быть пустым(```required```).
Также мы в ```connect``` передали ```middleware: logger```, для того чтобы в консоли увидеть как происходит валидация

В ```props``` нашего компонента мы получили набор функций
1. ```vBoo.isValid()``` - возвращает ```true```, если все компоненты ввода прошли валидацию
2. ```vBoo.hasError(name)``` - возвращает ```true```, если компонент со свойством ```name``` не валидин
3. ```vBoo.getError(name)``` - для компонента со свойством ```name```, возвращает текст ошибки

##### Управление валидацией в зависимости от языка
В функцию ```connect``` можно передать язык ```lang```, для того чтобы можно было менять правила валидации в зависимости от того на каком языке мы работаем,
а также выводить ошибки на нужном языке.

```javascript
import React, {Component} from 'react';
import {connect, Form, Input, InputCheckbox} from 'react-validation-boo';

class MyForm extends Component {
    sendForm = (event) => {
        event.preventDefault();

        if(this.props.vBoo.isValid()) {
            console.log('Получаем введённые значения и отправляем их на сервер', this.props.vBoo.getValues());
        } else {
            console.log('Выведем в консоль ошибки', this.props.vBoo.getErrors());
        }
    };
    getError = (name) => {
        return this.props.vBoo.hasError(name) ? <div className="error">{this.props.vBoo.getError(name)}</div> : '';
    };
    render() {
        return <Form connect={this.props.vBoo.connect}>
            <div>
                <label>{this.props.vBoo.getLabel('name')}:</label>
                <Input type="text" name="name" />
                {this.getError('name')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('email')}:</label>
                <Input type="text" name="email" value="default@mail.ru" />
                {this.getError('email')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('remember')}:</label>
                <InputCheckbox name="remember" value="yes" />
                {this.getError('remember')}
            </div>
            
            <button onClick={this.sendForm}>
                {this.props.vBoo.isValid() ? 'Можно отправлять': 'Будьте внимательны!!!'}
            </button>
        </Form>
    }
}

export default connect({
    rules: (lang) => {
        let rules =  [
            [
                ['name', 'email'],
                'required',
                {
                    error: '%name% не должно быть пустым'
                }
            ],
            ['email', 'email']
        ];
        
        rules.push(['remember', lang === 'ru' ? 'required': 'valid']);
        return rules;
    },
    labels: (lang) => ({
        name: 'Имя',
        email: 'Электронная почта',
        remember: 'Запомнить'
    }),
    lang: 'ru'
})(MyForm);
```

В данном примере чекбокс ```remember``` на русском язык обязательно должен быть установлен ```required```,
а на других он всегда валиден ```valid```.

Также мы передали в ```connect``` функцию ```labels(lang)```, которая возвращает название полей в читаемом виде.

В ```props``` вашего компонента, есть функция ```getLabel(name)```, которая возвращает значение переданное функцией ```labels```
или если такого значения нет, то возвращает ```name```. 


##### Базовые компоненты
```Form``` форма в которой находятся поля ввода для валидации

```Input``` стандартное ```html input``` поля ввода к которой прикрепляются правила валидации ```type!=(radio|checkbox)``` 

```InputRadio``` стандартное ```html input(type=radio)```

```InputCheckbox``` стандартное ```html input(type=checkbox)```

```Select``` стандартное ```html select```

```Textarea``` стандартное ```html textarea```

```javascript
import React, {Component} from 'react';
import {connect, Form, Input, Select, InputRadio, InputCheckbox, Textarea} from 'react-validation-boo';

class MyForm extends Component {
    sendForm = (event) => {
        event.preventDefault();

        if(this.props.vBoo.isValid()) {
            console.log('Получаем введённые значения и отправляем их на сервер', this.props.vBoo.getValues());
        } else {
            console.log('Выведем в консоль ошибки', this.props.vBoo.getErrors());
        }
    };
    getError = (name) => {
        return this.props.vBoo.hasError(name) ? <div className="error">{this.props.vBoo.getError(name)}</div> : '';
    };
    render() {
        return <Form connect={this.props.vBoo.connect}>
            <div>
                <label>{this.props.vBoo.getLabel('name')}:</label>
                <Input type="text" name="name" />
                {this.getError('name')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('email')}:</label>
                <Input type="text" name="email" value="default@mail.ru" />
                {this.getError('email')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('gender')}:</label>
                <Select name="gender" multiple>
                    <option disabled>Ваш пол</option>
                    <option value="1">Мужской</option>
                    <option value="2">Женский</option>
                </Select>
                {this.getError('gender')}
            </div>
            <div>
                <div>{this.props.vBoo.getLabel('familyStatus')}:</div>
                <div>
                    <InputRadio name="familyStatus" value="1" checked />
                    <label>холост</label>
                </div>
                <div>
                    <InputRadio name="familyStatus" value="2" />
                    <label>сожительство</label>
                </div>
                <div>
                    <InputRadio name="familyStatus" value="3" />
                    <label>брак</label>
                </div>
                {this.getError('familyStatus')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('comment')}:</label>
                <Textarea name="comment"></Textarea>
                {this.getError('comment')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('remember')}:</label>
                <InputCheckbox name="remember" value="yes" />
                {this.getError('remember')}
            </div>
            
            <button onClick={this.sendForm}>
                {this.props.vBoo.isValid() ? 'Можно отправлять': 'Будьте внимательны!!!'}
            </button>
        </Form>
    }
}

export default connect({
    rules: () => ([
        [
            ['name', 'email'],
            'required',
            {
                error: '%name% не должно быть пустым'
            }
        ],
        ['email', 'email'],
        [['gender', 'familyStatus', 'comment', 'remember'], 'valid']
    ]),
    labels: () => ({
        name: 'Имя',
        email: 'Электронная почта',
        gender: 'Пол',
        familyStatus: 'Семейное положение',
        comment: 'Комментарий',
        remember: 'Запомнить'
    }),
    lang: 'ru'
})(MyForm);
```

##### Правила валидации
```valid```, ```required```, ```email```, ```number```, ```url```, ```string-length```, ```not-empty-array```
На данный момент библиотека имеет небольшой набор правил валидаций, поэтому эти правила вам прийдётся писать самим.

Для того чтобы написать правило необходимо создать класс, который будет унаследован от класса ```validator```

```javascript
import {validator} from 'react-validation-boo';

class myValidator extends validator {
    /**
    * name - имя поля, если есть label то передастся он
    * value - текущее значение поля
    * params - параметры которые были переданны 3-м агрументом в правила валидации(rules)
    */
    validate(name, value, params) {
        let lang = this.getLang();
        let pattern = /^\d+$/;
        
        if(!pattern.test(value)) {
            let error = params.error || 'Ошибка для поля %name% со значением %value%';
            error = error.replace('%name%', name);
            error = error.replace('%value%', value);
            this.addError(error);
        }
    }
}

export default myValidator;
```

Давайте теперь подключим наш валидатор к форме

```javascript
import myValidator from 'path/myValidator';

// ...

export default connect({
    rules: () => ([
        [
            'name',
            'required',
            {
                error: '%name% не должно быть пустым'
            }
        ],
        [
            'name',
            'myValidator',
            {
                error: 'это и будет params.error'
            }
        ]
    ]),
    labels: () => ({
        name: 'Имя'
    }),
    validators: {
        myValidator
    },
    lang: 'ru'
})(MyForm);
```

##### Сценарии

Давайте рассмотрим случаи когда нам необходимо менять правила валидации в зависимости от действий производимых на форме.

По умолчанию у нас сценарий который называется ```default```, в правилах мы можем прописать при каком сценарии проводить данную валидацию.
Если сценарий не указан, то валидация будет выполняться для всех сценариев.

```javascript
rules = () => ([
    [
        'name',
        'required',
        {
            error: '%name% не должно быть пустым'
        }
    ],
    [
        'name',
        'myValidator',
        {
            scenario: ['default', 'scenario1']
        }
    ],
    [
        'email',
        'email',
        {
            scenario: 'scenario1'
        }
    ]
])
```
Через свойство ```props``` нашего компонента передаются функции:
1. ```vBoo.setScenario(scenario)``` Устанавливает сценарий ```scenario```, может быть как строка так и массив, если у нас активны сразу несколько сценариев
2. ```vBoo.getScenario()``` Возвращает текущий сценарий или массив сценариев
3. ```vBoo.hasScenario(name)``` Показывает установлен ли сейчас данный сценарий, ```name``` строка 

```javascript
import React, {Component} from 'react';
import {connect, Form, Input, Select, InputRadio, InputCheckbox, Textarea} from 'react-validation-boo';

class MyForm extends Component {
    constructor() {
        super();

        this.scenaries = {
            'scenario-married': false,
            'scenario-addition': false
        }
    }
    changeScenaries(addScenaries = [], deleteScenaries = []) {
        addScenaries.forEach(item => this.scenaries[item] = true);
        deleteScenaries.forEach(item => this.scenaries[item] = false);

        let scenario = Object.keys(this.scenaries)
            .reduce((result, item) => this.scenaries[item]? result.concat(item): result, []);

        this.props.vBoo.setScenario(scenario);
    }
    addScenaries = (m = []) => this.changeScenaries(m, []);
    deleteScenaries = (m = []) => this.changeScenaries([], m);
    sendForm = (event) => {
        event.preventDefault();

        if(this.props.vBoo.isValid()) {
            console.log('Получаем введённые значения и отправляем их на сервер', this.props.vBoo.getValues());
        } else {
            console.log('Выведем в консоль ошибки', this.props.vBoo.getErrors());
        }
    };
    getError = (name) => {
        return this.props.vBoo.hasError(name) ? <div className="error">{this.props.vBoo.getError(name)}</div> : '';
    };
    changeFamilyStatus = (event) => {
        let val = event.target.value;
        if(val !== '1') {
            this.addScenaries(['scenario-married'])
        } else {
            this.deleteScenaries(['scenario-married']);
        }
    };
    changeAddition = (event) => {
        let check = event.target.checked;
        if(check) {
            this.addScenaries(['scenario-addition'])
        } else {
            this.deleteScenaries(['scenario-addition']);
        }
    };
    getCommentContent() {
        if(this.props.vBoo.hasScenario('scenario-married')) {
            return (
                <div key="comment-content">
                    <label>{this.props.vBoo.getLabel('comment')}:</label>
                    <Textarea name="comment"></Textarea>
                    {this.getError('comment')}
                </div>
            );
        }

        return '';
    }
    getAdditionContent() {
        if(this.props.vBoo.hasScenario('scenario-addition')) {
            return (
                <div key="addition-content">
                    <label>{this.props.vBoo.getLabel('place')}:</label>
                    <Input type="text" name="place" />
                    {this.getError('place')}
                </div>
            );
        }

        return '';
    }
    render() {
        return <Form connect={this.props.vBoo.connect}>
            <div>
                <label>{this.props.vBoo.getLabel('name')}:</label>
                <Input type="text" name="name" />
                {this.getError('name')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('email')}:</label>
                <Input type="text" name="email" value="default@mail.ru" />
                {this.getError('email')}
            </div>
            <div>
                <label>{this.props.vBoo.getLabel('gender')}:</label>
                <Select name="gender" multiple>
                    <option disabled>Ваш пол</option>
                    <option value="1">Мужской</option>
                    <option value="2">Женский</option>
                </Select>
                {this.getError('gender')}
            </div>
            <div>
                <div>{this.props.vBoo.getLabel('familyStatus')}:</div>
                <div>
                    <InputRadio name="familyStatus" value="1" checked onChange={this.changeFamilyStatus} />
                    <label>холост</label>
                </div>
                <div>
                    <InputRadio name="familyStatus" value="2" onChange={this.changeFamilyStatus} />
                    <label>сожительство</label>
                </div>
                <div>
                    <InputRadio name="familyStatus" value="3" onChange={this.changeFamilyStatus} />
                    <label>брак</label>
                </div>
                {this.getError('familyStatus')}
            </div>
            {this.getCommentContent()}
            <div>
                <label>{this.props.vBoo.getLabel('addition')}:</label>
                <InputCheckbox name="addition" value="yes" onChange={this.changeAddition} />
                {this.getError('addition')}
            </div>
            {this.getAdditionContent()}

            <button onClick={this.sendForm}>
                {this.props.vBoo.isValid() ? 'Можно отправлять': 'Будьте внимательны!!!'}
            </button>
        </Form>
    }
}

export default connect({
    rules: () => ([
        [
            ['name', 'gender', 'familyStatus', 'email'],
            'required',
            {
                error: '%name% не должно быть пустым'
            }
        ],
        ['email', 'email'],
        [
            'comment',
            'required',
            {
                scenario: 'scenario-married'
            }
        ],
        ['addition', 'valid'],
        [
            'place',
            'required',
            {
                scenario: 'scenario-addition'
            }
        ],
    ]),
    labels: () => ({
        name: 'Имя',
        email: 'Электронная почта',
        gender: 'Пол',
        familyStatus: 'Семейное положение',
        comment: 'Комментарий',
        addition: 'Дополнительно',
        place: 'Место'
    }),
    lang: 'ru'
})(MyForm);
```

##### Создание компонентов.
По мимо использования стандартных компонентов вы можете использовать свои.
Создадим компонент ```InputBlock```, который будет в себе содержать ```label``` и вывод ошибок.

```javascript
import React, {Component} from 'react';
import {Input} from 'react-validation-boo';

class InputBlock extends Input {
    getError = () => {
        return this.props.vBoo.hasError() ? <div className="error">{this.props.vBoo.getError()}</div> : '';
    };
    render() {
        return (
            <div>
                <label>{this.props.vBoo.getLabel()}:</label>
                <input {...this.props} onChange={this.change} onBlur={this.blur} />
                {this.getError()}
            </div>
        );
    }
}

export default InputBlock;
```
Заменим все стандартные элементы на блоки
```javascript
import React from 'react';
import {InputCheckbox} from 'react-validation-boo';

class InputCheckboxBlock extends InputCheckbox {
    getError = () => {
        return this.props.vBoo.hasError() ? <div className="error">{this.props.vBoo.getError()}</div> : '';
    };
    render() {
        return (
            <div>
                <label>{this.props.vBoo.getLabel()}:</label>
                <input {...this.props} type="checkbox" onChange={this.change} />
                {this.getError()}
            </div>
        );
    }
}

export default InputCheckboxBlock;
```

```javascript
import React, {Component} from 'react';
import {Textarea} from 'react-validation-boo';

class TextareaBlock extends Textarea {
    getError = () => {
        return this.props.vBoo.hasError() ? <div className="error">{this.props.vBoo.getError()}</div> : '';
    };
    render() {
        return (
            <div>
                <label>{this.props.vBoo.getLabel()}:</label>
                <textarea {...this.props} onChange={this.change} onBlur={this.blur} />
                {this.getError()}
            </div>
        );
    }
}

export default TextareaBlock;
```
Напишим блок для ```Select``` так чтобы опции можно было передовать не только через теги option, а ещё через массив.
```javascript
let genderOptions = [
    {
        value: '',
        label: 'Ваш пол?',
        disabled: true
    },
    {
        value: 1,
        label: 'Мужской'
    },
    {
        value: 2,
        label: 'Женский'
    }
];
<SelectBlock name="gender" options={genderOptions} />

<SelectBlock name="gender">
    <option disabled>Ваш пол</option>
    <option value="1">Мужской</option>
    <option value="2">Женский</option>
</SelectBlock>
```

```javascript
import React, {Component} from 'react';
import {Select} from 'react-validation-boo';

class SelectBlock extends Select {
    componentWillMount() {
        this.children = this.props.options ? this.__getOptions(): this.props.children;
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.value !== nextProps.value) {
            this.props.vBoo.change(nextProps.value);
        }
    }
    __getOptions() {
        return this.props.options.map((item) => {
            return <option value={item.value} disabled={item.disabled}>{item.label}</option>;
        });
    }
    getError = () => {
        return this.props.vBoo.hasError() ? <div className="error">{this.props.vBoo.getError()}</div> : '';
    };
    render() {
        return (
            <div>
                <label>{this.props.vBoo.getLabel()}:</label>
                <select {...this.props} onChange={this.change}>
                    {this.children}
                </select>
                {this.getError()}
            </div>
        );
    }
}

export default SelectBlock;
```

Осталось реализовать компонент ```InputRadioGroupBlock```, мы будем его реализовывать не на базе существующих, а с нуля.
Компонент ```Form``` библиотеки ```react-validate-boo``` ищет среди своих потомков элименты с полем name
и в них через ```props```передаёт объект ```vBoo``` в этом объекте и находятся все необходимые методы для работы с валидацией компонента.
Для начала напишим как мы будем использовать компонент
```javascript
let familyRadioList = [
    {
        value: 1,
        label: 'холост'
    },
    {
        value: 2,
        label: 'сожительство'
    },
    {
        value: 3,
        label: 'брак'
    }
];
<InputRadioGroupBlock name="familyStatus" items={familyRadioList} />

```

```javascript
import React, {Component} from 'react';

export default class InputRadioGroupBlock extends Component {
    state = {
        value: ''
    };
    componentDidMount() {
        this.setState({value: this.props.value});
        this.props.vBoo.mount(this.state.value);
    }
    componentWillUnmount() {
        this.props.vBoo.unMount();
    }
    componentWillReceiveProps(nextProps) {
        let value = nextProps.value;
        if(this.props.value !== nextProps.value) {
            this.setState({value});
            this.props.vBoo.change(value);
        }
    }
    getOptions() {
        return this.props.items.map(item => {
            let checked = (this.state.value||'').toString()===(item.value||'').toString();
            return <div key={item.value}>
                       <input type="radio" name={this.props.name} value={item.value} checked={checked} onChange={this.change} />
                       <label>{item.label}</label>
                   </div>;
        });
    }
    change = (event) => {
        let value = event.target.value;
        this.props.onChange && this.props.onChange(event);
        this.setState({value});
        this.props.vBoo.change(value);
    };
    getError = () => {
        return this.props.vBoo.hasError() ? <div className="error">{this.props.vBoo.getError()}</div> : '';
    };
    render() {
        return (
            <div>
                <div>{this.props.vBoo.getLabel()}:</div>
                {this.getOptions()}
                {this.getError()}
            </div>
        );
    }
}
```