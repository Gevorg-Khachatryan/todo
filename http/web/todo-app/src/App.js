import logo from './logo.svg';
import './App.css';
import React from "react";
import ReactDOM from "react-dom";

// import ReactHtmlParser from 'html-react-parser';


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
        // show_add_todo.onchange = this.showAddTodo
        ReactDOM.render([<button id="show_add_todo" className="button" onClick={this.showAddTodo}>Add</button>,
            <button id="show_todo_list" className="button"
                    onClick={this.homePage.bind(this)}>List</button>], actions[0])

    }

    render() {
        const {error, isLoaded, items} = this.state;
        console.log(this.state.data, 123);

        return true;

    }

    changeTodoStatus(e) {
        let element = e.target
        let id = element.dataset.id
        console.log(id)
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
                .then(r => r.json())
                .then(data => console.log('data returned:', data));
        } else {
            fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: ' mutation deleteTodo {deleteTodo(id: "' + id + '") {success}}',
                })
            })
                .then(r => r.json())
                .then(data => console.log('data deleted:', data));
        }
    }

    showAddTodo(e) {
        let container = document.getElementById('content')
        console.log(container)
        ReactDOM.render([React.createElement('input', {type: 'text', name: 'title'}),
            React.createElement('input', {type: 'text', name: 'desc'}),
            <button id="add_todo" type="submit" onClick={this.addTodo}>ok</button>], container)
    }

    showUpdateTodo(e) {
        let container = document.getElementById('content')
        console.log()
        this.setState({
            id: e.target.parentElement.getAttribute('data_id')
        })
        ReactDOM.render([React.createElement('input', {type: 'text', name: 'title', id:'todo_title'}),
            React.createElement('input', {type: 'text', name: 'desc', id:'todo_desc'}),
            <button  onClick={this.updateTodo.bind(this)}>ok</button>], container)
    }

    addTodo(e) {
        let container = document.getElementById('content')
        ReactDOM.render([React.createElement('input', {type: 'text', name: 'title'}),
            React.createElement('input', {type: 'text', name: 'desc'}),
            <button  onClick={this.addTodo}>ok</button>], container)
    }

    updateTodo(e) {
        let container = document.getElementById('content')
        console.log(container,this.state.id,'444bbb')
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
            .then(r => r.json())
            .then(data => console.log('data returned:', data));
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
                        console.log(element.completed)

                        let row = React.createElement('tr', {
                                className: 'info',
                                data_id: element.id,
                                onClick: this.showUpdateTodo.bind(this)
                            },
                            <td>{element.title}</td>,
                            <td>{element.desc}</td>,
                            <td><select data-id={element.id} onChange={this.changeTodoStatus}>
                                <option value="complete" className="complete"
                                        selected={element.completed ? true : false}>Completed
                                </option>
                                <option value="uncomplete" className="uncomplete"
                                        selected={!element.completed ? true : false}>Uncompleted
                                </option>
                                <option value="delete" className="delete">Delete</option>
                            </select></td>
                        )
                        rows.push(row)
                    })
                    ReactDOM.render(<table id="list_todos">
                        <tbody>{rows}</tbody>
                    </table>, list_todos)
                    // let elements2 = document.getElementsByClassName("actions")
                    // for (var i = 0; i < elements2.length; i++) {
                    //     elements2[i].addEventListener('change', (e) => {
                    //         console.log('click2')
                    //         console.log('click21', e)
                    //         if (e.target.value != 'delete') {
                    //             fetch('http://localhost:5000/graphql', {
                    //                 method: 'POST',
                    //                 headers: {
                    //                     'Content-Type': 'application/json',
                    //                     'Accept': 'application/json',
                    //                 },
                    //                 body: JSON.stringify({
                    //                     query: " mutation updateTodo {" +
                    //                         'updateTodo(todo: {id:"' + e.target.getAttribute("data-id") + '"' +
                    //                         'completed:"' + e.target.value + '"}) {title}}',
                    //                 })
                    //             })
                    //                 .then(r => r.json())
                    //                 .then(data => console.log('data returned:', data));
                    //         } else {
                    //             fetch('/graphql', {
                    //                 method: 'POST',
                    //                 headers: {
                    //                     'Content-Type': 'application/json',
                    //                     'Accept': 'application/json',
                    //                 },
                    //                 body: JSON.stringify({
                    //                     query: ' mutation deleteTodo {deleteTodo(id: "' + e.target.getAttribute("data-id") + '") {success}}',
                    //                 })
                    //             })
                    //                 .then(r => r.json())
                    //                 .then(data => console.log('data deleted:', data));
                    //         }
                    //
                    //     })
                    // }
                }
                // console.log(data)
                // let elements = document.getElementsByClassName("info")
                // for (var i = 0; i < elements.length; i++) {
                //
                //     elements[i].addEventListener('click', (element) => {
                //         console.log(element.target.parentElement.dataset.id)
                //         fetch('http://localhost:5000/graphql', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //                 'Accept': 'application/json',
                //             },
                //             body: JSON.stringify({
                //                 query: '{ getTodo (id: "' + element.target.parentElement.dataset.id + '")' +
                //                     ' { post { id title desc } success errors } }',
                //
                //             })
                //         })
                //             .then(r => r.json())
                //         // .then(data => f(data))
                //     })
                // }
            });
    }
}


export default MyComponent;