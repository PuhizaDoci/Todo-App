import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Tasks from './pages/Tasks'
import TaskLists from './pages/Lists'
import LogIn from './pages/Login'
import SignUp from './pages/SignUp'
import User from './pages/User'
import NavbarPage from "./components/Navbar";
import {createBrowserHistory} from 'history';
import ProtectedRoute from "./components/ProtectedRoute";

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <NavbarPage/>

                <Switch>
                    <ProtectedRoute exact path='/' component={Tasks}/>
                    <ProtectedRoute path='/tasks' component={Tasks}/>
                    <ProtectedRoute path='/lists' component={TaskLists}/>
                    <ProtectedRoute path='/user' component={User}/>
                    <Route path='/login' component={LogIn}/>
                    <Route path='/signup' component={SignUp}/>

                    <Route
                        render={function () {
                            return <h1>Not Found</h1>;
                        }}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
