import logo from './logo.svg';
import './App.css';
import React from "react";
import ReactDOM from "react-dom";


class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        this.homePage()
        let actions = document.getElementsByClassName('actions')
        ReactDOM.render([<button id="show_add_todo" className="button"
                                 onClick={this.showAddTodo.bind(this)}>Add</button>,
            <button id="show_todo_list" className="button"
                    onClick={this.homePage.bind(this)}>List</button>], actions[0])

    }

    render() {
        return true;
    }

    changeTodoStatus(e) {
        let element = e.target
        let id = element.dataset.id
        if (element.value != 'delete') {
            fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: " mutation updateTodo {" +
                        'updateTodo(todo: {id:"' + id + '"' +
                        'completed:"' + element.value + '"}) {title}}',
                })
            })
                .then(this.homePage.bind(this))
        } else {
            fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: ' mutation deleteTodo {deleteTodo(id: "' + id + '") {success}}',
                })
            })
            .then(this.homePage.bind(this))
        }
    }

    showAddTodo(e) {
        let container = document.getElementById('content')
        console.log(container)
        ReactDOM.render([React.createElement('input', {type: 'text', name: 'title', id: 'todo_title'}),
            React.createElement('input', {type: 'text', name: 'desc', id: 'todo_desc'}),
            <button id="add_todo" type="submit" onClick={this.addTodo.bind(this)}>ok</button>], container)
    }

    showUpdateTodo(e) {
        if (e.target.type != 'select-one') {
            let container = document.getElementById('content')
            this.setState({
                id: e.target.parentElement.getAttribute('data_id')
            })
            ReactDOM.render([React.createElement('input',
                {
                    type: 'text',
                    name: 'title',
                    id: 'todo_title',
                    defaultValue: e.target.parentElement.getAttribute('data_title')
                }),
                React.createElement('input',
                    {
                        type: 'text',
                        name: 'desc',
                        id: 'todo_desc',
                        defaultValue: e.target.parentElement.getAttribute('data_desc')
                    }),
                <button onClick={this.updateTodo.bind(this)}>ok</button>], container)
        }
    }

    addTodo(e) {
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: " mutation newTodo {" +
                    'createTodo(todo: {' +
                    'title:"' + document.getElementById('todo_title').value + '"' +
                    'desc:"' + document.getElementById('todo_desc').value + '"}) {title}}'
            })
        })
            .then(this.homePage.bind(this))
    }

    updateTodo(e) {
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: " mutation updateTodo {" +
                    'updateTodo(todo: {' +
                    'id:"' + this.state.id + '"' +
                    'title:"' + document.getElementById('todo_title').value + '"' +
                    'desc:"' + document.getElementById('todo_desc').value + '"' +
                    'completed:"' + e.target.value + '"}) {title}}',
            })
        })
            .then(this.homePage.bind(this))
    }

    homePage(e) {
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: "{ listTodos {success errors post {id title desc completed} }}"})
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data: data})
                let success
                if (data.listTodos) {
                    success = data.listTodos.success
                } else {
                    success = data.getTodo.success
                }
                let list_todos = document.getElementById('content')
                if (success) {
                    let todos = data.listTodos.post
                    let rows = []
                    todos.forEach((element, index, array) => {
                        let td = React.createElement('td', {children: element.title})
                        let row = React.createElement('tr', {
                                className: 'info',
                                data_id: element.id,
                                data_title: element.title,
                                data_desc: element.desc,
                                onClick: this.showUpdateTodo.bind(this)
                            },
                            <td>{element.title}</td>,
                            <td>{element.desc}</td>,
                            <td><select data-id={element.id} onChange={this.changeTodoStatus.bind(this)} value={element.completed ? 'complete' : 'uncomplete'}>
                                <option value="complete" className="complete">Completed
                                </option>
                                <option value="uncomplete" className="uncomplete">Uncompleted
                                </option>
                                <option value="delete" className="delete">Delete</option>
                            </select></td>
                        )
                        rows.push(row)
                    })
                    ReactDOM.render(<table id="list_todos">
                        <tbody>{rows}</tbody>
                    </table>, list_todos)
                }
            });
    }
}


export default MyComponent;