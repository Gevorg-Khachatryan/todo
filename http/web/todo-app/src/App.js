import logo from './logo.svg';
import './App.css';
import React from "react";


class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            data: []
        };
    }

    componentDidMount() {
        this.getTodosList()
    }

    render() {
        const data = this.state.data
        const inputs_section = this.state.inputs_section
        return <>
            <div className="header">
                <div className="title">TODO</div>
            </div>

            <div className="flex-container">
                <div className="actions">
                    <button id="show_add_todo" className="button"
                            onClick={this.showAddTodo.bind(this)}>Add
                    </button>
                    <button id="show_todo_list" className="button"
                            onClick={this.getTodosList.bind(this)}>List
                    </button>
                </div>

                <div id="content">
                    <table>
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
                                            value={item.completed ? 'complete' : 'uncomplete'}>
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
                    {inputs_section}
                </div>
            </div>
        </>
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
        this.setState({data:[],
                inputs_section:[
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
                inputs_section:[
                <input type="text" name="title" id="todo_title" defaultValue={e.target.parentElement.getAttribute('data-title')}/>,
                <input type="text" name="desc" id="todo_desc" defaultValue={e.target.parentElement.getAttribute('data-desc')}/>,
                <button onClick={this.updateTodo.bind(this)}>ok</button>],
                data:[]
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
                    this.setState({'data': todos, inputs_section:[]})
                }
            });
    }
}


export default MyComponent;