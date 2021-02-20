import React, { Component } from 'react';
import ArtListItem from './ArtListItem';
import '../styles/sidebar.scss';

class ClosingArtsSideBarList extends Component {

    render() {
        return (
            <div className="art-side-bar-wrapper pr-2">
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
                <ArtListItem artTitle="Leonardo Da Vinci" currentHighestBid="4500" timeLeft="60" />
            </div>
        );
    }
}

export default ClosingArtsSideBarList;