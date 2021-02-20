import React from 'react';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBView } from 'mdbreact';
import '../styles/card.scss';

const MenuCard = (props) => {
  return (
    <MDBView hover zoom>
        <MDBCard>
            <MDBCardImage className="img-fluid" src={props.imageSrc} waves />
            <MDBCardBody>
                <MDBCardTitle>{props.title}</MDBCardTitle>
                <MDBCardText>{props.description}</MDBCardText>          
            </MDBCardBody>
        </MDBCard> 
    </MDBView>   
  )
}

export default MenuCard;