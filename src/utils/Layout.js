import React, { Component } from 'react';
import NavigationBar from '../components/NavigationBar';

class Layout extends Component {
    constructor(props){
        super(props);
        this.state = {
            baseAppState: this.props.baseAppState
        }
    }

    render() {
        return (
            <div>
                <NavigationBar baseAppState={this.state.baseAppState} refreshStateCallback={()=>this.props.refreshStateCallback()}/>
                {this.props.children}
            </div>
        );
    }
}

export default Layout;