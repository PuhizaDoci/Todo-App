import {Redirect, Route} from 'react-router-dom'
import React from 'react'

function ProtectedRoute({ children, component: Component, ...rest }) {
    const id = localStorage.getItem('id');
     return id && 0 <= id.length
         ? (<Route {...rest} component={Component} />)
         : (<Redirect to={'/login' }/>)
}

export default ProtectedRoute