import React from 'react';
import Dashboard from '@containers/dashboard';
export default class Auth extends React.Component{
  static getInitialProps(context, config){
    return {};
  }
  render(){
    return <Dashboard {...this.props} />
  }
}