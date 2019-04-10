import React, { Component } from 'react';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
class Base extends Component {
  render() {
    return (
      <div>
        <MainNav />

        <h5>
          This is the base page that will include all of the components that
          need to be included on every page
        </h5>
        <main> {this.props.children}</main>
        <Footer />
      </div>
    );
  }
}

export default Base;
