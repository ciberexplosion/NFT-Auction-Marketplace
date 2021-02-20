import { MDBAnimation, MDBBtn, MDBCard, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import AddItemForm from '../components/AddItem';
import AuctionedArtsSideBarList from '../components/AuctionedArtsSideBarList';
import '../styles/drop-file.scss';
import Validator from '../utils/validator';
import HashHelper from '../utils/hashHelper';
import ArtAlert from '../components/ArtAlert';
import ipfs from '../ipfs.js';
import Util from '../utils/Util';

class MarketPlaceSell extends Component {
    constructor(props){
        super(props);
        this.state = {
            accounts: this.props.baseAppState.accounts,
            contract: this.props.baseAppState.contract,
            file: null,
            buffer: null,
            price: 0,
            increment: 0,
            duration: 0,
            ipfsHash: '', //final hash
            ipfsMultiHash: null,
            artHash: [],
            loading: {
                uploadFile: false,
                approveSeller: false
            },
            error: {
                uploadFile: ''
            },
            success: {
                uploadFile: ''
            }
        };
        
        this.getFileBuffer = this.getFileBuffer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event)=>{
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        this.setState({[key]: value});
    }

    getFileBuffer = () =>{
        console.log('file loaded');
        if(this.state.file){            
            var file = this.state.file;
            var reader = new FileReader()  //Convert to a buffer

            reader.readAsArrayBuffer(file); //Parse file
            reader.onload = () => {
                this.convertToBuffer(reader);//Fired after reading operation is completed                            
            }
        }
    }

    //helper function for turning file to buffer
    convertToBuffer = async (reader) => {
        const buffer = Buffer(reader.result);
        this.setState({buffer}, 
            console.log('file buffer', buffer));
        
    };


    resetFileSelection = ()=>{
        this.setState({buffer: null});
        this.setState({file: null});
    }

    fetchMyArtItems = () =>{
        console.log("fetch my art items method");
    }

    addArtItem(){
        const contract = this.state.contract;
        const account = this.state.accounts[0];
        let hashHelper = new HashHelper();
        let util = new Util();

        let IPFShash = hashHelper.getBytes32FromIpfsHash(this.state.ipfsHash);
        let price = this.state.price;
        let increment = this.state.increment;
        let duration = util.ConvertHoursToSeconds(this.state.duration);        

        if(isNaN(price) || isNaN(duration) || isNaN(increment)){
            console.log("invalid input was detected!");
            return null;
        }

        console.log(IPFShash, price, increment, duration);
        let response = contract.methods.addArtItem(price, IPFShash, increment, duration).send({from: account});
        
        response.then(result => {
            console.log('add art: ', result);
            if(result.status){
                this.setState(prevState => ({
                    success: {
                        ...prevState.success,
                        uploadFile: 'Success — New Art Item was added successfully!'
                }}));
            }else{
                this.setState(prevState => ({
                    error: {
                        ...prevState.error,
                        uploadFile: 'Error — A minor error occured. Take a look at the log'
                }})); 
            }
            this.fetchMyArtItems();
        }).catch(error=>{
            console.log('add art item error: ', error);
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: error.message
            }})); 
        }); 
    }

    resetMessage = () =>{
        let errors = Object.keys(this.state.error);
        for(var propIndex in errors){

            let prop = errors[propIndex];
            console.log(prop);

            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    [prop]: ''
            }}));
            
            //console.log(this.state.error);
        }
        
        //this.setState({success: null});
    }

    resetInputs = () => {
        this.setState({price: 0});
        this.setState({duration: 0});
        this.setState({increment: 0});
    }

    resetDocumentSelection = ()=>{
        this.setState({buffer: null});
        this.setState({file: null});
    }

    onIPFSSubmit = async(event)=>{
        event.preventDefault();
        // this.resetMessage();
        console.log("Submitting file to ipfs");        

        let price = this.state.price;
        let increment = this.state.increment;
        let duration = this.state.duration;

        
        if(!increment || !duration || !price){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Incomplete Details — All fields are required!'
            }})); 
            return;
        }

        // validate data
        let validator = new Validator();

        if(!validator.isValidPrice(price)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Price — Minimum auction price must be a number that is not less than 0!'
            }})); 
            return;
        }

        if(!validator.isValidIncrement(increment)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Increment — Increment must be a number between 0-100!'
            }})); 
            return;
        }

        if(!validator.isValidDuration(duration)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Duration — Auction duration (in hours) must be a number between 1-168!'
            }})); 
            return;
        }

        this.setState(prevState => ({
            loading: {
                ...prevState.loading,
                uploadFile: true
        }}));        

        if(!this.state.file){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid File Selection — Please re-select your art file'
            }})); 
        }
        const bufferData = this.state.buffer;
        console.log('bufferData', bufferData);
        if(bufferData){
            ipfs.add(bufferData)
            .then((ipfsHash) => {
                console.log(ipfsHash);
                this.setState({ipfsHash: ipfsHash.path});
                this.setState({ipfsMultiHash: ipfsHash.cid.multihash});
                
                this.setState(prevState => ({
                    loading: {
                        ...prevState.loading,
                        uploadFile: false
                }}), this.resetDocumentSelection());

                //TODO: send to blockchain
                this.addArtItem();

                // this.setState(prevState => ({
                //     success: {
                //         ...prevState.success,
                //         uploadFile: 'Your Art has been successfully added!'
                // }})); 
                this.resetInputs();
                console.log('complete ipfs upload');                
            })
            .catch(err => {
                console.log(err);
                this.setState(prevState => ({
                    error: {
                        ...prevState.error,
                        uploadFile: 'Error occured while uploading art to IPFS. Try again.'
                }})); 
            })
        }else{
            console.log('no file was selected. reload page and re-select file');
            
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid File Selection — Please re-select your art file'
            }})); 
            
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    uploadFile: false
            }}), this.resetDocumentSelection());
            return;
        }
         
    };

    render() {
        return (
            <MDBContainer className="page-container">
                <MDBRow>
                    <MDBCol md={3}>
                        <div className={`drop-file ${this.state.file ? "file-loaded" : ""}`}>
                            <MDBAnimation type="bounce-in">                                
                                <Dropzone onDrop={acceptedFiles => this.setState({file: acceptedFiles[0]}, this.getFileBuffer)}>
                                    {({getRootProps, getInputProps}) => (                                
                                        <MDBCard {...getRootProps()}>
                                            <section className="m-3">
                                                <input {...getInputProps()} />
                                                <MDBIcon icon="cloud-upload-alt" size="4x" />
                                                <p className="">{this.state.file ? "File loaded. Fill the Art Auction Information" : <span>Drag 'n' drop your art file HERE,<br /><br />OR<br /><br />Click to select</span>}</p>
                                            </section>
                                        </MDBCard>                                
                                    )}
                                </Dropzone>
                                
                            </MDBAnimation>                     
                        </div>
                    </MDBCol>
                    <MDBCol md={6} className="px-4">
                        <form>
                            <h1>Marketplace Sell</h1>
                            <hr />
                            <h6><b>Art Auction Details</b></h6>
                            <MDBRow>
                                {this.state.error.uploadFile ? 
                                    <ArtAlert onCloseCallback={this.resetMessage} type="danger" message={this.state.error.uploadFile} />                                        
                                :null}
                                {this.state.success.uploadFile ? 
                                <ArtAlert onCloseCallback={this.resetMessage} type="success" message={this.state.success.uploadFile} />                                        
                                :null}                                
                                <MDBCol md={6}>
                                    <label htmlFor="minPrice" className="grey-text mt-2">
                                        Minimum Price
                                    </label>
                                    <input type="number" value={this.state.price} min={0} onChange={this.handleChange} id="minPrice" name="price" className="form-control" />
                                </MDBCol>
                                <MDBCol md={6}>
                                    <label htmlFor="increment" className="grey-text mt-2">
                                        Increment
                                    </label>
                                    <input type="number" value={this.state.increment} min={0} onChange={this.handleChange} id="increment" name="increment" className="form-control" />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol md={6}>
                                    <label htmlFor="duration" className="grey-text mt-2">
                                        Auction Duration (in hours)
                                    </label>
                                    <input type="number" value={this.state.duration} min={0} onChange={this.handleChange} id="duration" name="duration" className="form-control" />
                                </MDBCol>
                                <MDBCol md={6}>
                                    
                                </MDBCol>
                            </MDBRow>                            
                            <MDBRow>
                                <MDBContainer className="mt-3">
                                    <MDBBtn onClick={this.onIPFSSubmit} block color="info" >Add Art Item</MDBBtn>
                                </MDBContainer>
                            </MDBRow>
                        </form>
                    </MDBCol>
                    <MDBCol md={3} style={{marginTop: '0px'}}>
                        <h4>My Auctioned Arts</h4>
                        <hr />
                        <AuctionedArtsSideBarList />
                    </MDBCol>
                </MDBRow>               
            </MDBContainer>
        );
    }
}

export default MarketPlaceSell;