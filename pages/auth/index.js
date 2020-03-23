import React from 'react';
import Authentication from '@containers/auth';
export default class Auth extends React.Component{
  static getInitialProps(context, config){
    return {};
  }
  render(){
    return <Authentication {...this.props} />
  }
}