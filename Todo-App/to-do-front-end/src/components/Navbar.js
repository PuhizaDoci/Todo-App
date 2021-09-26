import React, {Component} from "react";
import {
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem
} from "mdbreact";
import {Link} from 'react-router-dom';

class NavbarPage extends Component {
    state = {
        isOpen: false,
        loggedIn: false,
        fullName: ''
    };

    componentDidMount() {
        const userId = localStorage.getItem('id')
        const fullName = localStorage.getItem('fullName')
        if (userId && 0 <= userId.length) {
            this.setState({
                ...this.state,
                loggedIn: true,
                fullName: fullName
            });
        }
    }

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    logout = () => {
        localStorage.clear();

        this.setState({
            ...this.state,
            loggedIn: false
        });
    }

    render() {
        const {loggedIn, fullName} = this.state;

        return (
            <MDBNavbar color="indigo" dark expand="md">
                <MDBContainer>
                    <MDBNavbarBrand>
                        <strong className="white-text">PolyDo</strong>
                    </MDBNavbarBrand>

                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                    <MDBCollapse id="navbarCollapse3"
                                 isOpen={this.state.isOpen} navbar
                                 className={'align-items-center'}
                    >
                        {loggedIn && <MDBNavbarNav left>
                            <MDBNavItem className="mr-3">
                                <Link to="/tasks" className="text-white">Tasks</Link>
                            </MDBNavItem>
                            <MDBNavItem>
                                <Link to="/lists" className="text-white">List of tasks</Link>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        }

                        <MDBNavbarNav right
                                      className={'align-items-center d-flex justify-content-center'}
                        >
                            {!loggedIn && <>
                                <MDBNavItem className="mr-3 ml-3 mt-2">
                                    <Link
                                        to="/login"
                                        className="text-white">
                                        Login</Link>
                                </MDBNavItem>
                                <MDBNavItem
                                    className="mt-2">
                                    <Link
                                        to="/signup"
                                        className="text-white">
                                        Sign up</Link>
                                </MDBNavItem>
                            </>
                            }
                            {
                                loggedIn && <>
                                    <MDBNavItem className="mr-3 ml-3 mt-1">
                                        <Link to="/user" className="text-white">{fullName}</Link>
                                    </MDBNavItem>

                                    <MDBNavItem className="ml-3 mt-2">
                                        <Link to={'/login'} onClick={this.logout}>
                                            <MDBIcon floating
                                                     icon="sign-out-alt"
                                                     size="lg"
                                                     className="text-light"
                                            />
                                        </Link>
                                    </MDBNavItem>
                                </>
                            }
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        );
    }
}

export default NavbarPage;