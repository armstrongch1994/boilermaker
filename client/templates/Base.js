import React, { Component } from 'react';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
class Base extends Component {
  render() {
    return (
      <div>
        <MainNav />
        <main> {this.props.children}</main>
        <Footer />
      </div>
    );
  }
}

export default Base;
