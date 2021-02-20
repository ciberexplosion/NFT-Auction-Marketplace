import { MDBAnimation, MDBCol, MDBContainer, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import ClosingArtsSideBarList from '../components/ClosingArtsSideBarList';
import MenuCard from '../components/Card';
import {Link} from 'react-router-dom';

class Home extends Component {
    constructor(props){
        super(props);

    }

    render() {
        return (
            <MDBContainer className="">
                <MDBRow>
                    <MDBCol md="9" lg="9" xl="9">
                        <MDBRow>
                            <MDBCol sm="6" md="6" lg="6" xl="6" className="menu-card p-2">
                                <MDBAnimation type="bounceIn">
                                    <Link to='/marketplace/buy'>
                                        <MenuCard 
                                            title="Buy Art Item"
                                            description="Purchase Art item, and receive a Non-Fungible Token (NFT)"
                                            imageSrc={'https://image.freepik.com/free-vector/collection-hand-drawn-foxes_52683-20559.jpg'} 
                                            //https://image.freepik.com/free-vector/collection-watercolor-autumn-animals_23-2148264447.jpg
                                        />
                                    </Link>
                                </MDBAnimation>
                            </MDBCol>
                            <MDBCol sm="6" md="6" lg="6" xl="6" className="menu-card p-2">
                                <MDBAnimation type="bounceIn" delay=".4s">
                                    <Link to='/marketplace/sell'>
                                        <MenuCard 
                                            title="Sell Art Item"
                                            description="Add an Art item for auction" 
                                            imageSrc={'https://image.freepik.com/free-vector/stack-cryptocurrency-tokens_109132-67.jpg'} 
                                            //https://image.freepik.com/free-vector/coins-money-isolated-icon_24877-57997.jpg
                                        />
                                    </Link>
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

export default Home;
