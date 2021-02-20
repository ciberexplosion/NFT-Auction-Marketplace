import React, { Component } from 'react';
import NavigationBar from '../components/NavigationBar';

class Layout extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <NavigationBar baseAppState={this.props.baseAppState}/>
                {this.props.children}
            </div>
        );
    }
}

export default Layout;