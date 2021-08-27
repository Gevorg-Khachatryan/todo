import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Link} from "react-router-dom";
import MultipageApp from "./MultiPageApp";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <div>
                <nav className="nav">
                    <Link to="/single-page-app">
                        <h2>Single Page App</h2>
                    </Link>
                    <Link to="/multi-page-app">
                        <h2>Multi Page App</h2>
                    </Link>
                </nav>
            </div>
             <div >
                <Switch>
                    <Route path="/" exact component={App}/>
                    <Route path="/single-page-app" component={App}/>
                    <Route path="/multi-page-app" component={MultipageApp}/>
                </Switch>
            </div>
        </Router>

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
