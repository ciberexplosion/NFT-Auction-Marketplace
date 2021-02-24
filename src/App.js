// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Layout from './utils/Layout';
import HelperFunctions from './utils/Util';
// import Switch from 'react-bootstrap/esm/Switch';
import Home from './pages/Home';
import MarketPlaceBuy from './pages/MarketPlaceBuy';
import MarketPlaceSell from './pages/MarketPlaceSell';
import Unauthorized from './pages/Unathorized';
import NotFound from './pages/NotFound';
import { Component } from 'react';
import getWeb3 from "./getWeb3";
import ArtAuction from "./abis/ArtAuction.json";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      web3: null, 
      accounts: null, 
      contract: null,
      isAuthenticated: true,
      pageLoading: true
    };

    // this.userSignin = this.userSignin.bind(this);
  }

  componentWillUnmount=()=>{
    localStorage.removeItem('isAuthenticated');
  }

  componentDidMount = async ()=>{
    try{
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const myContractAddress = '0x2446CA20c8887cD37Ae2dA2B1F540b1d6e25B2cd';

      // Get the contract instance.
      const instance = new web3.eth.Contract(ArtAuction.abi,
        myContractAddress);

      //for local development
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ArtAuction.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   ArtAuction.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    //   localStorage.setItem('contract',JSON.stringify(instance));
      localStorage.setItem('accounts',accounts);
      this.setState({web3: web3, accounts: accounts, contract: instance });
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }    
  };

  /*userSignin = () =>{
    // sign user in
    const { accounts, contract } = this.state;
    let user = contract.methods.getUser().call({from: accounts[0]});
    user.then(response => {
      //authentication is successful
      console.log('user: ',response);

      if(response && response[0] == true){
        this.setState({isAuthenticated: true});
        localStorage.setItem('isAuthenticated', true);
        
        this.setState({pageLoading: false});
      }
    }).catch(error=>{
      this.setState({isAuthenticated: false});
      localStorage.setItem('isAuthenticated', false);
      this.setState({pageLoading: false});
    })   
    
  }*/

  render(){
    return (
      <div className="App">
        <Router>      
        <Layout baseAppState={this.state}>   
            <Switch>
              <Route exact path="/" render={()=>{return(this.state.isAuthenticated ? <Redirect to="/home"/> : <Redirect to="/unauthorized"/>)}} />            
              <Route exact path="/marketplace" render={()=>{return(this.state.isAuthenticated ? <Redirect to="/marketplace/sell"/> : <Redirect to="/unauthorized"/>)}} />            
              
              <Route exact path="/home" render={props => {return(this.state.isAuthenticated ? <Home {...props} baseAppState={this.state} />  : <Redirect to="/unauthorized"/> )} } />
              <Route exact path="/marketplace/buy" render={props => {return(this.state.isAuthenticated ? <MarketPlaceBuy {...props} baseAppState={this.state} />  : <Redirect to="/unauthorized"/> )} } />
              <Route exact path="/marketplace/sell" render={props => {return(this.state.isAuthenticated ? <MarketPlaceSell {...props} baseAppState={this.state} />  : <Redirect to="/unauthorized"/> )} } />
              <Route exact path="/unauthorized" render={props => {return(this.state.isAuthenticated ? <Redirect to="/home"/>  : <Unauthorized {...props} baseAppState={this.state} /> )}} />
              <Route path="/404" render={props => {return(<NotFound  {...props} />)}} />
              <Redirect to="/404" />            
            </Switch>
          </Layout>
        </Router>
      </div>
    );
  }
}

export default App;
