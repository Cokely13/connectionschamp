import React from 'react';
import { connect } from 'react-redux';
import Upload from './Upload';


/**
 * COMPONENT
 */
export const Home = (props) => {
  const { username } = props;

  return (
    <div className="home-container">
     <Upload/>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
