import React from "react";
import {MDBBtn, MDBCard, MDBCol, MDBContainer, MDBInput, MDBRow} from 'mdbreact';
import './SignUp.css';
import httpClient from "../axios-config";
import {toast, ToastContainer} from "react-toastify";

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                name: '',
                lastName: '',
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

    handleChangeFirstName = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            name: event.target.value
        });
    }

    handleChangeLastName = (event) => {
        event.preventDefault();

        this.setState({
            ...this.state,
            lastName: event.target.value
        });
    }

    handleSubmit = (event) => {
        const {name, email, password, lastName} = this.state;

        const data = {
            userid: 0,
            firstName: name,
            lastName: lastName,
            email: email,
            password: password
        };

        httpClient.post("signup", data)
            .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                    localStorage.setItem('id', response.data.userid)
                    localStorage.setItem('fullName', data.firstName + ' ' + data.lastName)
                    localStorage.setItem('email', data.email)
                    localStorage.setItem('password', data.password)

                    toast.success("User created successfully!")
                    window.location.replace('/');
                }
            })
            .catch((error) => console.log(error))

        event.preventDefault();
    }

    render() {
        return (
            <>
                <MDBContainer center className={'sign-up-page'}>
                    <MDBRow center className="row-5 login-page row-container-signup">
                        <MDBCol md="7" middle="true" sm="8">
                            <MDBCard className={'card-login'}>
                                <form onSubmit={this.handleSubmit}>
                                    <p className="h5 text-center mb-4">Sign up</p>
                                    <div className="grey-text">
                                        <MDBInput label="First Name" icon="user" group type="text" validate error="wrong"
                                                  success="right" value={this.state.value} name="name"
                                                  onChange={this.handleChangeFirstName}/>
                                        <MDBInput label="Last Name" icon="user" group type="text" validate error="wrong"
                                                  success="right" value={this.state.value} name="name"
                                                  onChange={this.handleChangeLastName}/>
                                        <MDBInput label="Email" icon="envelope" group type="email" validate
                                                  error="wrong"
                                                  success="right"
                                                  onChange={this.handleChangeEmail}
                                        />
                                        <MDBInput label="Password" icon="lock" group type="password" validate
                                                  value={this.state.value} name="password"
                                                  className={'mb-2'}
                                                  onChange={this.handleChangePassword}/>
                                    </div>
                                    <div className="text-center">
                                        <MDBBtn type="submit" value="Submit"
                                                color={'indigo'}
                                            size={'md'}
                                        >Register</MDBBtn>
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

export default SignUpPage;