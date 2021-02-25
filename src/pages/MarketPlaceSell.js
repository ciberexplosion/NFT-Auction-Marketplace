import { MDBAnimation, MDBBtn, MDBCard, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Validator from '../utils/validator';
import HashHelper from '../utils/hashHelper';
import ArtAlert from '../components/ArtAlert';
import LightBox from '../components/LightBox';
import ipfs from '../ipfs.js';
import HelperFunctions from '../utils/Util';
import Spinner from '../components/Spinner';
import ArtListItem from '../components/ArtListItem';

import '../styles/sidebar.scss';
import '../styles/drop-file.scss';
import { util } from 'chai';
import TimeAgo from 'javascript-time-ago';


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
            name: '',
            duration: 0,
            artToView: {},
            ipfsHash: '', //final hash
            ipfsMultiHash: null,
            artHash: [],
            myAuctionedItems: [],
            showFileLightBox: false,
            loading: {
                uploadFile: false,
                addItemBtn: false
            },
            error: {
                uploadFile: '',
                auctionedItems: ''
            },
            success: {
                uploadFile: '',
                auctionedItems: ''
            }
        };
        
        this.getFileBuffer = this.getFileBuffer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openArt = this.openArt.bind(this);
        this.fetchMyArtItems();
    }

    componentDidMount(){
        if(!this.state.accounts){
            this.setState({accounts: localStorage.getItem('accounts')});
        }
        // if(!this.state.contract){
        //     this.setState({contract: localStorage.getItem('contract')});
        // }
        // this.fetchMyArtItems();
    }

    componentWillMount= async ()=>{
        const contract = this.state.contract;
        if ( !contract ) {
            let util = new HelperFunctions();
            let response = await util.reloadContractAndAccounts();
            this.setState({ web3: response.web3, accounts: response.accounts, contract: response.contract });
        }
    }

    componentDidUpdate(){
        // if(!this.state.accounts){
        //     this.setState({accounts: this.props.baseAppState.accounts});
        // }
        // if(!this.state.contract){
        //     this.setState({contract: this.props.baseAppState.contract});
        // }
        // 
        console.log('contract', this.props.baseAppState.contract);
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
        const contract = this.state.contract;
        if(!this.state.accounts) return;
        const account = this.state.accounts[0];        

        // get added items through events emitted
        contract.getPastEvents('LogAddItem', {
            filter: {seller: account},  
            fromBlock: 0,
            toBlock: 'latest'
        }, (error, events) => {       
            if (!error){
                console.log('events', events);                
                // var obj = JSON.parse(JSON.stringify(events));
                // var array = Object.keys(obj)
        
                // console.log("returned values",obj[array[0]].returnValues);
                let oldMyAuctionedItems = [];
                events.forEach(event => {
                    let itemId = event.returnValues[0];
                    let name = event.returnValues[1];
                    let seller = event.returnValues[2];
                    let price = event.returnValues[3];
                    let created = event.returnValues[4];
                    let expiry = event.returnValues[5];
                    
                    oldMyAuctionedItems.push({itemId: itemId, name: name, owner: seller, price: price, created: created, expiry: expiry});
                    
                });
                this.setState({myAuctionedItems: oldMyAuctionedItems});
            }
            else {
                console.log(error)
            }
        })       
    }

    addArtItem(){
        
        let contract = this.state.contract;
        if(typeof contract === 'string' && typeof contract !== 'object' && typeof contract !== null){
            contract = JSON.parse(contract);
        }
        console.log('add item contract', contract);
        const account = this.state.accounts[0];
        console.log('add item account', account);

        let hashHelper = new HashHelper();
        let util = new HelperFunctions();

        let IPFShash = hashHelper.getBytes32FromIpfsHash(this.state.ipfsHash);
        let price = this.state.price;
        let increment = this.state.increment;
        let name = this.state.name;
        let duration = util.ConvertHoursToSeconds(this.state.duration);        

        if(isNaN(price) || isNaN(duration) || isNaN(increment) || !isNaN(name)){
            console.log("invalid input was detected!");
            return null;
        }

        console.log('art item details:: ', name, IPFShash, price, increment, duration);

        let response = contract.methods.addArtItem(price, IPFShash, increment, duration, name).send({from: account});
        
        response.then(result => {
            console.log('add art: ', result);
            if(result.status && result.events.LogAddItem){
                let oldMyAuctionedItems = this.state.myAuctionedItems;
                oldMyAuctionedItems.push({name: name, ipfs: this.state.ipfsHash, price: price, increment: increment, created: util.GetUNIXTimeFromDate(Date.now()), expiry: duration})
                this.setState({myAuctionedItems: oldMyAuctionedItems});
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
        this.setState({name: ''});
    }

    resetDocumentSelection = ()=>{
        this.setState({buffer: null});
        this.setState({file: null});
    }

    onIPFSSubmit = async(event)=>{
        event.preventDefault();
        // this.resetMessage();
        this.setState(prevState => ({
            loading: {
                ...prevState.loading,
                addItemBtn: true
        }}));        
        console.log("Submitting file to ipfs");        

        let price = this.state.price;
        let increment = this.state.increment;
        let duration = this.state.duration;
        let name = this.state.name;
        
        if(!this.state.accounts){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Your account is not yet loaded. You may refresh page of it persists.'
            }})); 
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
            return;
        }
        
        if(!increment || !duration || !price || name === ''){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Incomplete Details — All fields are required!'
            }})); 
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
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
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
            return;
        }

        if(!validator.isValidIncrement(increment)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Increment — Increment must be a number between 0-100!'
            }})); 
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
            return;
        }

        if(!validator.isValidDuration(duration)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Duration — Auction duration (in hours) must be a number between 1-168!'
            }})); 
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
            return;
        }

        if(!validator.isValidName(name)){
            this.setState(prevState => ({
                error: {
                    ...prevState.error,
                    uploadFile: 'Invalid Name — Art name cannot be a number!'
            }})); 
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
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
                        uploadFile: 'Error occured while uploading art to IPFS. Check your connection or Reload the page and try again.'
                }})); 
            })
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
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
            this.setState(prevState => ({
                loading: {
                    ...prevState.loading,
                    addItemBtn: false
            }}));
            return;
        }        
    };

    getArtItem = (itemId)=>{
        console.log("get bid method");
        const contract = this.state.contract;
        if(!this.state.accounts) return;
        const account = this.state.accounts[0];    
        console.log('open art item');
        console.log('contract', contract);
        console.log('accout', account);
        console.log(itemId);
        return contract.methods.getArtItem(itemId).call({from: account});
    }

    OnCloseLightBox = () => {
        this.setState({showFileLightBox: false});
    }

    openArt=(itemId, ipfsHash, name)=> event=>{
        let hashHelper = new HashHelper();
        event.stopPropagation();
        // console.log('open art item');
        // console.log(itemId, ipfsHash, name);

        if(ipfsHash && name){// just added art
            console.log('new added art');
            console.log(ipfsHash, name);
            let ref = hashHelper.getIpfsHashFromBytes32(ipfsHash);
            this.setState({artToView: {ipfsHash: ref, name: name}}, this.setState({showFileLightBox: true}));

        }else{//fetched arts
            //get art name and ipfs hash
            let response = this.getArtItem(itemId);
            response.then(result =>{
                console.log('get art ',result);
                if(result){
                    let artName = result[7];
                    let artIPFShash = result[2];

                    let ref = hashHelper.getIpfsHashFromBytes32(artIPFShash);

                    this.setState({artToView: {ipfsHash: ref, name: artName}}, this.setState({showFileLightBox: true}));
                }
            }).catch(error=>{
                console.log(error);
            });
        }
                        
    }


    render() {
        let util = new HelperFunctions();
        const timeAgo = new TimeAgo('en-US');
        
        return (            
            <div>
                {this.state.showFileLightBox ? 
                    <LightBox toView={this.state.artToView} closeLightBoxCallback={this.OnCloseLightBox} />: null
                    }
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
                                    <label htmlFor="name" className="grey-text mt-2">
                                        Name
                                    </label>
                                    <input type="text" value={this.state.name} onChange={this.handleChange} id="name" name="name" className="form-control" />
                                </MDBCol>                          
                                <MDBCol md={6}>
                                    <label htmlFor="minPrice" className="grey-text mt-2">
                                        Minimum Price
                                    </label>
                                    <input type="number" value={this.state.price} min={0} onChange={this.handleChange} id="minPrice" name="price" className="form-control" />
                                </MDBCol>
                                
                            </MDBRow>
                            <MDBRow>
                                <MDBCol md={6}>
                                    <label htmlFor="increment" className="grey-text mt-2">
                                        Increment (1-100)
                                    </label>
                                    <input type="number" value={this.state.increment} min={0} onChange={this.handleChange} id="increment" name="increment" className="form-control" />
                                </MDBCol>
                                <MDBCol md={6}>
                                    <label htmlFor="duration" className="grey-text mt-2">
                                        Auction Duration (in hours:: 1-168)
                                    </label>
                                    <input type="number" value={this.state.duration} min={0} onChange={this.handleChange} id="duration" name="duration" className="form-control" />
                                </MDBCol>
                            </MDBRow>                            
                            <MDBRow>
                                <MDBContainer className="mt-3">
                                    <MDBBtn onClick={this.onIPFSSubmit} block color="info" >{this.state.loading.addItemBtn || this.state.loading.uploadFile ? <Spinner size="small"/> : <span>Add Art Item</span> }</MDBBtn>
                                </MDBContainer>
                            </MDBRow>
                        </form>
                    </MDBCol>
                    <MDBCol md={3} style={{marginTop: '0px'}}>
                        <h4>My Auctioned Arts</h4>
                        <hr />
                        <div className="art-side-bar-wrapper pr-2">
                            {this.state.myAuctionedItems.length > 0 ?
                                this.state.myAuctionedItems.map((item, index) => {
                                    return (<span onClick={this.openArt(item.itemId, item.ipfsHash, item.name)}>
                                    <ArtListItem key={index} artTitle={item.name} currentHighestBid={item.price} timeLeft={timeAgo.format(util.GetDateFromUNIXTime(Number(item.created) + Number(item.expiry)), 'twitter')} />
                                    </span>);
                                })
                            : <h6>You currently have no auctioned items</h6>}
                        </div>
                    </MDBCol>
                </MDBRow>               
            </MDBContainer>
        
            </div>    
        );
    }
}

export default MarketPlaceSell;