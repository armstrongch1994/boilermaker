import React, { Component } from 'react';
import Base from './Base';
class Home extends Component {
  render() {
    return (
      <Base>
        <div> This is the 'homepage' that users will land on by default.</div>
        <h3> This is a test </h3>
      </Base>
    );
  }
}

export default Home;
