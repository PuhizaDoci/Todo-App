import React from "react";
import { MDBRow, MDBCol, MDBBtn, MDBContainer, MDBCard } from "mdbreact";
import {toast, ToastContainer} from "react-toastify";
import httpClient from "../axios-config";

class UserPage extends React.Component {
  state = {
    loggedIn: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    userid:"",
    disabled: true,
    errors: {},
    passwordChanging: false
  };

  componentDidMount() {
    const userId = localStorage.getItem('id')
    const fullName = localStorage.getItem('fullName')
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')

    if (userId && 0 <= userId.length) {
        this.setState({
            ...this.state,
            loggedIn: true,
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ')[1],
            email: email,
            userid: userId,
            password: password
        });
    }
}
  
  onDeactivateButtonClick = event =>{
      event.preventDefault();
      
    if (window.confirm('Do you want to deactivate your account?'))
        {
            httpClient.delete(`/delete/user/${this.state.userid}`)
                .then((res) => {
                    if (res.status >= 200 && res.status < 400) {

                    localStorage.clear(); 
                    this.setState({
                        ...this.state,
                        loggedIn: false
                    });

                    toast.info("User deactivated!")
                    
                    window.location.replace('/signup');
                    }
                })
            .catch((err) => {
                toast.error("User deactivation failed!")
            });
        }
  }

  onChangeButtonClick = event => {
    event.preventDefault();
    this.state.passwordChanging = this.state.disabled;
    this.setState( {disabled: !this.state.disabled} )
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  
  submitHandler = event => {
    event.preventDefault();
    console.log('camehere')
    let valid = this.validate()
    console.log(valid)
    console.log(this.state.errors)
    if(valid){
        this.updateUser()
    }
  };
  
  validate(){
     let errors = {};
     let isValid = true;

    if (!this.state.firstName) {
        isValid = false;
        
        errors["firstName"] = "Please enter your first name.";
      }
      
    console.log(this.state.lastName)
      if (!this.state.lastName) {
        isValid = false;
        errors["lastName"] = "Please enter your last name.";
      }
      
    console.log(this.state.email)
      if (!this.state.email) {
        isValid = false;
        errors["email"] = "Please enter your email address.";
      }

      if (typeof this.state.email !== "undefined") {
          
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.email)) {
          isValid = false;
          errors["email"] = "Please enter valid email address.";
        }
      }
      
      if (typeof this.state.password !== "undefined" && 
      typeof this.state.password2 !== "undefined" && this.state.passwordChanging) {
          
        if (this.state.password != this.state.password2) {
          isValid = false;
          errors["password"] = "Passwords don't match.";
        }
      }
      
      this.setState({
        errors: errors
      });

      return isValid;
  }

  updateUser(){
    this.setState({
        ...this.state,
        loading: true
    });

    this.updateUserApi(this.state.userid, this.state)
        .then(response => {
            if (response.status >= 200 && response.status < 400) {
                this.setState({
                    ...this.state,
                    loading: false
                });

                toast.success("User updated successfully!")

                localStorage.setItem('id', this.state.userid)
                localStorage.setItem('fullName', this.state.firstName + ' ' + this.state.lastName)
                localStorage.setItem('email', this.state.email)
                localStorage.setItem('password', this.state.password)

                window.location.replace('/user');
            }
        })
        .catch((error) => {
            toast.success("There was an error updating user. Try again!")
        })
}

    updateUserApi = (userId, newUser) => {
        return httpClient.post(`update/user/${userId}`, newUser);
    }

  render() {
    return (
      <MDBContainer className="mt-4">
        <form
          className="needs-validation"
          onSubmit={this.submitHandler}
          noValidate
        >
          <MDBRow center className="row-5 login-page row-container">
            <MDBCol md="6" sm="7">
             <MDBCard className={'card-login'}>
              <label
                htmlFor="defaultFormRegisterNameEx"
                className="grey-text mt-1"
              >
                First name
              </label>
              <input
                value={this.state.firstName}
                name="firstName"
                onChange={this.changeHandler}
                type="text"
                id="defaultFormRegisterNameEx"
                className="form-control"
                placeholder="First name"
                required
              />
              
              <div className="text-danger">{this.state.errors.firstName}</div>

              <div className="valid-feedback">Looks good!</div>

              <label
                htmlFor="defaultFormRegisterEmailEx2"
                className="grey-text mt-3"
              >
                Last name
              </label>
              <input
                value={this.state.lastName}
                name="lastName"
                onChange={this.changeHandler}
                type="text"
                id="defaultFormRegisterEmailEx2"
                className="form-control"
                placeholder="Last name"
                required
              />
              <div className="text-danger">{this.state.errors.lastName}</div>

              <div className="valid-feedback">Looks good!</div>
              <label
                htmlFor="defaultFormRegisterConfirmEx3"
                className="grey-text mt-3"
              >
                Email
              </label>
              <input
                value={this.state.email}
                onChange={this.changeHandler}
                type="email"
                id="defaultFormRegisterConfirmEx3"
                className="form-control mb-1"
                name="email"
                placeholder="Your Email address"
              />
              
              <div className="text-danger">{this.state.errors.email}</div>

            <div className="d-flex align-items-center justify-content-between p-0 m-0 mt-3 mb-2">
                <MDBBtn size={'md'}
                        color={'info'}
                        className="p-2"
                        onClick = {this.onChangeButtonClick.bind(this)}
                >
                    Change password
                </MDBBtn>
            </div>
              <label
                htmlFor="defaultFormRegisterConfirmEx3"
                className="grey-text mt-1"
              >
                Password
              </label>
              <input
                value={this.state.password}
                onChange={this.changeHandler}
                type="password"
                id="defaultFormRegisterConfirmEx3"
                className="form-control"
                name="password"
                placeholder="Your password"
                disabled = {this.state.disabled}
              />
              
               <div className="text-danger">{this.state.errors.password}</div>

               <label
                htmlFor="defaultFormRegisterConfirmEx3"
                className="grey-text mt-3"
              >
                Confirm password
              </label>
              <input
                value={this.state.password2}
                onChange={this.changeHandler}
                type="password"
                id="defaultFormRegisterConfirmEx3"
                className="form-control"
                name="password2"
                placeholder="Confirm"
                disabled = {this.state.disabled}
              />
              
              <div className="d-flex align-items-center justify-content-between p-0 m-0 mt-3">
                <MDBBtn type="submit"
                        value="Submit"
                        size={'md'}
                        color={'success'}
                        className="pt-2 pb-2"
                >
                    Save
                </MDBBtn>
                <MDBBtn size ={'md'}
                        color={'danger'}
                        className="p-2"
                        onClick={this.onDeactivateButtonClick}
                >
                    Deactivate
                </MDBBtn>
               </div>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </form>
        <ToastContainer/>
      </MDBContainer>
    );
  }
}

export default UserPage;