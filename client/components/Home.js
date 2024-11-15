import React from 'react';
import { connect } from 'react-redux';
import Upload from './Upload';
import Entries from './Entries';

export const Home = (props) => {
  const { username } = props;

  return (
    <div className="home-container">
      {/* <div className="entries-wrapper">
        <Entries />
      </div>
      <Upload /> */}
      <div className="entries-wrapper">
        <Entries />
      </div>
      {/* <div className="home-logo">
        <img src="/logo.png" alt="Logo" className="auth-logo-image" />
      </div> */}
      <Upload />
    </div>
  );
};

const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
