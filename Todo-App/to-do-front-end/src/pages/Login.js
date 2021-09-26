import React from "react";
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBInput, MDBRow} from 'mdbreact';
import httpClient from '../axios-config';
import './Login.css'
import {toast, ToastContainer} from "react-toastify";

class FormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state =
            {
                email: '',
                password: ''
            };
    }

    handleChangeEmail = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            email: event.target.value
        });
    }

    handleChangePassword = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            password: event.target.value
        });
    }

    handleSubmit = (event) => {
        const {email, password} = this.state;

        const data = {
            email: email,
            password: password
        };

        httpClient.post("login", data)
            .then((response) => {
                if (response.status >= 200 && response.status < 400 && response.data?.userid >= 1) {
                    localStorage.setItem('id', response.data.userid);
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('password', response.data.password);
                    localStorage.setItem('fullName', response.data.firstName + ' ' + response.data.lastName);

                    window.location.replace('/');
                } else {
                    toast.error('User not found. Sign Up instead!')
                }
            })
            .catch((error) => {
                console.error(error)
                toast.error("There was an error when signing in!")
            })

        event.preventDefault();
    }

    render() {
        return (
            <>
                <MDBContainer center className={'login-page'}>
                    <MDBRow center className="row-5 login-page row-container">
                        <MDBCol md="6" middle="true" sm="7">
                            <MDBCard className={'card-login'}>
                                <form onSubmit={this.handleSubmit}>
                                    <p className="h5 text-center mb-5">Sign in</p>
                                    <div className="grey-text">
                                        <MDBInput label="Email" icon="envelope" group type="email" validate
                                                  error="wrong"
                                                  success="right" value={this.state.value} name="email"
                                                  onChange={this.handleChangeEmail}/>
                                        <MDBInput label="Password" icon="lock"
                                                  onChange={this.handleChangePassword}
                                                  value={this.state.value} name="password"
                                                  group type="password"
                                                  className={'mb-2'}
                                                  validate/>
                                    </div>
                                    <div className="text-center">
                                        <MDBBtn type="submit"
                                                value="Submit"
                                                size={'md'}
                                                color={'indigo'}
                                        >
                                            Login
                                        </MDBBtn>
                                    </div>
                                </form>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>

                <ToastContainer/>
            </>
        );
    }
}

export default FormPage;