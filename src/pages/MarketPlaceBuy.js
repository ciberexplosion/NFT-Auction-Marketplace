import { MDBAnimation, MDBCol, MDBContainer, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import ClosingArtsSideBarList from '../components/ClosingArtsSideBarList';

class MarketPlaceBuy extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <MDBContainer className="page-container">
                <MDBRow>
                    <MDBCol md="9" lg="9" xl="9">
                        <h1>Buy an Art (NFT)</h1>
                        <MDBRow>
                            <MDBCol sm="6" md="3" lg="3" xl="3" className="p-2">
                                <MDBAnimation type="bounceIn">
                                    
                                </MDBAnimation>
                            </MDBCol>                                                                
                        </MDBRow>
                    </MDBCol>
                    
                    {/* show closing and latest auctions */}
                    <MDBCol md="3" lg="3" xl="3" className="sidebar">
                        <h2>CATCH UP</h2>
                        <hr />
                        <ClosingArtsSideBarList />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
    
        );
    }
}

export default MarketPlaceBuy;