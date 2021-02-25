import React, { Component } from 'react';
import Spinner from './Spinner';
import "../styles/lightbox-fileview.scss";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

class ArtView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileLoading: false,
            mediaFileURL: ''            
        }
    }

    componentWillMount() {
        this.setState({fileLoading:true});       
        console.log('file view');
        if(this.props.url){
            this.setState({fileLoading:false},
                this.setState({mediaFileURL: this.props.url}));            
        }
    }

    render() {
        return (
            <div className="row p-3 d-flex card w-100 h-100" >
                {/* file view */}
                <div className="col-12">
                    {this.state.fileLoading ? 
                        <Spinner/>
                    : 
                    <div>
                        <div className="col">
                            <span style={{fontSize: '24px', position: 'relative', top: '30px', zIndex:'100'}} className="mt-2 mb-0 pb-0">Art Name: {this.props.artName}</span>
                            {console.log(this.props.artName, this.state.mediaFileURL)}
                            <DocViewer
                                pluginRenderers={DocViewerRenderers}                                 
                                documents={[{uri: this.state.mediaFileURL}]} />
                            
                        </div>
                    </div>}                    
                </div>         
            </div>
        );
    }
}

export default ArtView;