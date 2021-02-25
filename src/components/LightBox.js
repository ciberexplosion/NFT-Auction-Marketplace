import React, { Component } from 'react';
import FsLightbox from 'fslightbox-react';
import ArtView from './ArtView';

class LightBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            toggler: false,
            files: [],
            groupFilesSources: [],
            key: 0,
            shouldOpenOnMount: true
        }
    }

    setToggler=()=>{
        this.setState({toggler: !this.state.toggler});
    }

    // lightbox requires a remount of component in order to update its props apart from "toggler"
    remountLightbox() {
        this.setState({
            shouldOpenOnMount: true
        }, this.setState({
            key: this.state.key + 1
        }));        
    }

    componentDidMount(){
        this.setToggler();        
        this.remountLightbox();
    }

    componentWillMount(){        
        //INDIVIDUAL FILES (NOT GROUPS)
        let newSources = 
                <div style={{width:'100%'}}>
                    <ArtView url={'https://ipfs.infura.io/ipfs/'+ this.props.toView.ipfsHash} artName={this.props.toView.name}>
                        {this.props.children}
                    </ArtView>
                </div>
            ;
        this.setState({groupFilesSources: [newSources]});                  
    }

    closeLightBox(){
        this.props.closeLightBoxCallback();
    }

    render() {
        
        return (
            <div className="light-box-container">
                
                {console.log('sources to fetch from',this.state.groupFilesSources),
                console.log('component toggler', this.state.toggler)}
                {this.state.groupFilesSources.length > 0 ? 
                    <FsLightbox
                        toggler={this.state.toggler}            
                        onClose={console.log("unmounted available"), () => this.closeLightBox()}
                        sources={this.state.groupFilesSources}
                        key={this.state.key}
                        openOnMount={this.state.shouldOpenOnMount}
                        // loadOnlyCurrentSource={true}
                    />:
                    <FsLightbox
                        toggler={this.state.toggler}            
                        onClose={console.log("unmounted not available"), () => this.closeLightBox()}
                        sources={[
                            <div style={{width:'100%'}}>
                                <h3>Art file is not available!</h3>
                            </div>
                        ]}
                        key={this.state.key}
                    />
                }   
            </div>
        );
    }
}

export default LightBox;