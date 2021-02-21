import Web3 from "web3";
import Portis from '@portis/web3';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {

      // Modern dapp browsers...
      if (window.ethereum) {
         //Use Portis
        const portis = new Portis('60297f41-80d5-49af-b114-68efa8dedaa1', 'maticMumbai');
        const web3 = new Web3(portis.provider);
        console.log("Injected web3 detected.", web3);
        resolve(web3);

        // const web3 = new Web3(window.ethereum);
        // try {
        //   // Request account access if needed
        //   await window.ethereum.enable();
        //   // Acccounts now exposed
        //   resolve(web3);
        // } catch (error) {
        //   reject(error);
        // }
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
