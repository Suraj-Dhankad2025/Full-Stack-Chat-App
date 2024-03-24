import React from 'react'
import Header from '../layout/Header';
import Footer from '../shared/Footer';

const AppLayout = () => (WrappedComponent) => {
  return (props) =>{
    return (
        <div>
            <Header/>
            <WrappedComponent {...props} />
            <Footer/>
        </div>
    )
  };
};

export default AppLayout;