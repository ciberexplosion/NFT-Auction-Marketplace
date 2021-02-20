import { MDBCard, MDBCol, MDBIcon, MDBRow, MDBTypography, MDBView } from 'mdbreact';
import React from 'react';
import '../styles/artlistitem.scss';

const ArtListItem = (props) => {
    return (
        <MDBView hover waves>
            <MDBCard className="art-list-item-wrapper">
                <MDBRow>
                    <MDBCol size="2" >
                        <MDBIcon far icon="file-image" size="3x" style={{color: 'rgba(130,130,130,1)'}}/>
                    </MDBCol>
                    <MDBCol size="10">
                        <MDBTypography tag='h6' variant="h6-responsive">{props.artTitle}</MDBTypography>
                        <MDBRow>
                            <MDBCol size="4">
                                <MDBIcon far icon="clock" /> {props.timeLeft}
                            </MDBCol>
                            <MDBCol size="8">
                                <MDBIcon icon="coins" /> {props.currentHighestBid}
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>        
            </MDBCard>        
        </MDBView>
    );
};

export default ArtListItem;