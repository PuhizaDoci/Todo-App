import React from 'react';
import {MDBContainer,} from 'mdbreact';
import './HomePage.css';

class HomePage extends React.Component {
    scrollToTop = () => window.scrollTo(0, 0);

    render() {
        return (
            <>
                <MDBContainer>
                    a
                </MDBContainer>
            </>
        );
    }
}

export default HomePage;
