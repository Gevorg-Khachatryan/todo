import React from "react";
import './App.css';

import {render} from "@testing-library/react";


class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.getTodosList()
        console.log(this.props)
    }

    render() {
        const data = this.state.data

        return <table>
            <tbody>
            {data.map((item, index) => (
                <tr key={index}
                    data-id={item.id}
                    data-title={item.title}
                    data-desc={item.desc}
                    onClick={this.showUpdateTodo.bind(this)}>
                    <td>{item.title}</td>
                    <td>{item.desc}</td>
                    <td><select data-id={item.id} onChange={this.changeTodoStatus.bind(this)}
                                defaultValue={item.completed ? 'complete' : 'uncomplete'}>
                        <option value="complete" className="complete">Completed
                        </option>
                        <option value="uncomplete" className="uncomplete">Uncompleted
                        </option>
                        <option value="delete" className="delete">Delete</option>
                    </select></td>
                </tr>
            ))}
            </tbody>
        </table>
    }

    getTodosList(e) {
        this.setState({'data': []})

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
                let success
                if (data.listTodos) {
                    success = data.listTodos.success
                } else {
                    success = data.getTodo.success
                }
                if (success) {
                    let todos = data.listTodos.post
                    this.setState({'data': todos, inputs_section: []})
                }
            });
    }
}


class TodoCRUD extends TodoList {
    constructor(props) {
        super(props);
        // this.state = {};
        this.changeTodoStatus = this.changeTodoStatus.bind(this);
        this.showAddTodo = this.showAddTodo.bind(this);
        this.showUpdateTodo = this.showUpdateTodo.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        console.log('daaaaaaaa')
    }

    changeTodoStatus(e) {
        let element = e.target
        let id = element.dataset.id
        if (element.value !== 'delete') {
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
                .then(this.getTodosList.bind(this))
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
                .then(this.getTodosList.bind(this))
        }
    }

    showAddTodo(e) {
        let container = document.getElementById('content')
        this.setState({
            data: [],
            inputs_section: [
                <input type="text" name="title" id="todo_title"/>,
                <input type="text" name="desc" id="todo_desc"/>,
                <button id="add_todo" type="submit" onClick={this.addTodo.bind(this)}>ok</button>
            ]
        })
    }

    showUpdateTodo(e) {
        if (e.target.type !== 'select-one') {
            this.setState({
                id: e.target.parentElement.getAttribute('data-id'),
                inputs_section: [
                    <input type="text" name="title" id="todo_title"
                           defaultValue={e.target.parentElement.getAttribute('data-title')}/>,
                    <input type="text" name="desc" id="todo_desc"
                           defaultValue={e.target.parentElement.getAttribute('data-desc')}/>,
                    <button onClick={this.updateTodo.bind(this)}>ok</button>],
                data: []
            })
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
            .then(this.getTodosList.bind(this))
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
            .then(this.getTodosList.bind(this))
    }
    render() {
        const inputs_section = this.state.inputs_section

        return [super.render(),inputs_section]
    }
}


class MultiPageApp extends React.Component {

    render() {
        return <div>
            {/*<TodoList/>*/}
            <TodoCRUD/>
        </div>
    }

}

export default MultiPageApp
