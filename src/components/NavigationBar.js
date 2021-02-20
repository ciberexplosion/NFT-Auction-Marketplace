import React, { Component } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBIcon } from "mdbreact";
import '../styles/navbar.scss';
import { NavLink } from "react-bootstrap";
import Util from '../utils/Util';

class NavbarPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      collapseID: "",
      accounts: this.props.baseAppState.accounts
    };
  }

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
    collapseID: prevState.collapseID !== collapseID ? collapseID : ""
  }));

  render() {
    let util = new Util();
    return (
      <MDBNavbar color="info-color" dark expand="md" style={{ marginTop: "20px" }}>
            <MDBNavLink to="/">
              <MDBNavbarBrand>
                <strong className="white-text">Art NFT Marketplace</strong>
              </MDBNavbarBrand>
            </MDBNavLink>
            <MDBNavbarToggler onClick={this.toggleCollapse("navbarCollapse3")} />
            <MDBCollapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
              <MDBNavbarNav right>
                <MDBNavItem>
                  {this.state.accounts ? util.GetMaskedAccount(this.state.accounts[0]) : null}
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink className="waves-effect waves-light" style={{marginTop: '6px'}} to="#!">
                    <MDBIcon fab icon="twitter" />
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink className="waves-effect waves-light" style={{marginTop: '6px'}} to="#!">
                    <MDBIcon fab icon="google-plus-g" />
                  </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBDropdown>
                    <MDBDropdownToggle nav>
                      <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg" className="rounded-circle z-depth-0"
                        style={{ height: "35px", padding: 0 }} alt="" />                    
                    </MDBDropdownToggle>
                    <MDBDropdownMenu className="dropdown-default" right>
                      <MDBDropdownItem href="#!">My account</MDBDropdownItem>
                      <MDBDropdownItem href="#!">Log out</MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>      
    );  
  }
}
export default NavbarPage;