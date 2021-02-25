import Web3 from "web3";
import Portis from '@portis/web3';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {

      // Modern dapp browsers...
      if (typeof window.ethereum !== 'undefined') {
        //use saved preferences
        if(localStorage.getItem('setWallet') === 'portis'){
          try{
            const portis = new Portis('28d6577c-2916-43bc-b4c5-f5dd87b9b62e', 'maticMumbai');
            const web3 = new Web3(portis.provider);
            console.log("saved portis wallet preference fetched", web3);
            resolve(web3);
          }catch(error){
            reject(error);
          }
        }else if(localStorage.getItem('setWallet') === 'metamask'){
          try {
            //USE METAMASK
            const web3 = new Web3(window.ethereum);            
            await window.ethereum.request({ method: 'eth_requestAccounts' });    
            console.log("saved metamask wallet preference fetched", web3);        
            resolve(web3);
          }catch (error) {
            reject(error);
          }
        }else{
          if(window.confirm('Press OK to use your Portis wallet. Press CANCEL to use Metamask or any other available wallet')){
            //USE PORTIS
            try{
              const portis = new Portis('28d6577c-2916-43bc-b4c5-f5dd87b9b62e', 'maticMumbai');
              const web3 = new Web3(portis.provider);
              console.log("new portis wallet preference saved", web3);
              localStorage.setItem('setWallet','portis');
              resolve(web3);
            }catch(error){
              reject(error);
            }
          }else{
            try {
              //USE METAMASK
              const web3 = new Web3(window.ethereum);            
              // Request account access if needed
              // await window.ethereum.enable();
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log("new metamask wallet preference saved", web3);
              localStorage.setItem('setWallet','metamask');
              // Acccounts now exposed
              resolve(web3);
            }catch (error) {
              reject(error);
            }
          }
        }
        
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        
        //Use Portis
        // const portis = new Portis('28d6577c-2916-43bc-b4c5-f5dd87b9b62e', 'maticMumbai');
        // const web3 = new Web3(portis.provider);
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
