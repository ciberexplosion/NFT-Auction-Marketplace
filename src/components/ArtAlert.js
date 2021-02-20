import React from "react";
import { MDBContainer, MDBAlert } from 'mdbreact';

const ArtAlert = (props) => {
  return (
    <MDBContainer>
        {/* types= success, danger, warning, info, primary, light, dark,  */}
      <MDBAlert onClose={() => props.onCloseCallback()} color={props.type} dismiss>
        <strong>{props.message}</strong>
      </MDBAlert>
    </MDBContainer>
  );
};

export default ArtAlert;