import './ConnectWallet.css'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Web3 from 'web3';
import {ethers} from 'ethers';


const ConnectWallet = ({setWeb3}) =>{
    const [currentWeb3, setCurrentWeb3] = useState();
    const [fromPriv,setFromPriv] = useState('');
    const [fromMnemonic, setFromMnemonic] = useState('');
    const [connected, setconnected]= useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState("Ethereum-Goerli");
    const [networkURL, setNetworkURL] = useState(process.env.REACT_APP_INFURA_ETH_GOERLI);
    const [currentAddress, setCurrentAddress]= useState('');
    const [balance, setBalance] = useState('');

    const transferWeb3 = (web3)=>{
        setWeb3(web3);
    }
    const metamskOFF = ()=>{
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
            window.ethereum.removeAllListeners('chainChanged');
            window.ethereum.removeAllListeners('accountsChanged');
          }
    }

    const connectMetamask = async() =>{
        const web = new Web3(window.ethereum);
        const chainId = await window.ethereum.request({
            "method": 'eth_chainId'
        });
        if (chainId === '0x5') {setSelectedNetwork('Ethereum-Goerli');}
        if (chainId === '0x13881') {setSelectedNetwork('Polygon-Mumbai');}
        if (chainId ===  '0x3e9') {setSelectedNetwork('Klaytn-Baobab');}
        if (chainId === '0x539') {setSelectedNetwork('Localhost');}
        const requestAccounts = await window.ethereum.request({
            "method": "eth_requestAccounts",
            "params": []
        })
        const address = await web.eth.getAccounts();

        
        const hexBalance = await window.ethereum.request({
            "method": 'eth_getBalance',
            "params": [
                address[0]
            ]
        })
        const strBalance = web.utils.fromWei(web.utils.hexToNumberString(hexBalance), "ether")
        setBalance(strBalance);
        setCurrentAddress(address[0]);
        setCurrentWeb3(web);
        transferWeb3(web)
        setconnected(true);
    }
    const networkSwitch = (event) =>{
        const value = event.target.value
        setSelectedNetwork(value);
        selectedNetworkURL(value);
    }
    const selectedNetworkURL = (network)=>{
        let nodeURL;
        switch(network){
            case "Ethereum-Goerli":
                nodeURL = process.env.REACT_APP_INFURA_ETH_GOERLI;
                break;
            case "Polygon-Mumbai":
                nodeURL = process.env.REACT_APP_INFURA_POLYGON_MUMBAI;
                break;
            case "Klaytn-Baobab":
                nodeURL = process.env.REACT_APP_KLAYTN_BAOBAB;
                break;
            case "Localhost":
                nodeURL = process.env.REACT_APP_LOCAL_TESTNET;
        }
        setNetworkURL(nodeURL);
    }

    const connectFromPriv = async(priv) =>{
        metamskOFF();
        const web = new Web3(new Web3.providers.HttpProvider(networkURL));
        const accounts = web.eth.accounts.wallet.add('0x'+priv);
        console.log('connect', accounts[0])
        web.eth.getChainId().then(console.log);
        setCurrentAddress(accounts[0].address);
        setCurrentWeb3(web);   
        transferWeb3(web);
        setconnected(true);
    }

    const connectFromMnemonic = (mnemonic) =>{
        metamskOFF();
        const tWeb = new Web3(new Web3.providers.HttpProvider(networkURL));
        const hdNode = ethers.Wallet.fromPhrase(mnemonic, tWeb.currentProvider);
        const web = new Web3(new Web3.providers.HttpProvider(networkURL));
        const accounts = web.eth.accounts.wallet.add(hdNode.privateKey);
        setCurrentAddress(accounts[0].address);
        setCurrentWeb3(web);   
        transferWeb3(web);
        setconnected(true);
    }


    const showBalance = async() =>{
        if(currentAddress==='') return;
        const weiBalance = await currentWeb3.eth.getBalance(currentAddress);
        setBalance(currentWeb3.utils.fromWei(weiBalance, 'ether'));
    }

    const logOut = ()=>{
        if (connected){
            transferWeb3();
            setCurrentWeb3();
            setFromPriv('');
            setFromMnemonic('');
            setconnected(false);
        }
    }

    useEffect(()=>{
        if(typeof currentWeb3!=='undefined'){
            const showNetwork = async()=>{
                const cNetwork =  await currentWeb3.eth.getChainId().then((id)=>{return id});
                console.log('fromConnectWallet: '+cNetwork )
            }
            showNetwork();
            showBalance()
    }
        
    }, [balance, currentWeb3, currentAddress, selectedNetwork])

    return (
    <div className="pageWrapper">{!connected ?
        <div className="walletConnectForm">
            <div className='connect3rdParty'>
                <Button variant="outline-primary" onClick={
                    connectMetamask
                }>Connect Metamask</Button>
            </div>
            <div className='selectNetwork' style={{marginTop: '40px', marginBottom: '120px'}}>
            <Form.Select value={selectedNetwork}  onChange={networkSwitch} aria-label="Default select example">
                <option value="Ethereum-Goerli">Ethereum-Goerli</option>
                <option value="Polygon-Mumbai">Polygon-Mumbai</option>
                <option value="Klaytn-Baobab">Klaytn-Baobab</option>
                <option value="Localhost">Localhost</option>
            </Form.Select>
            </div>
            <div className='connectFromPrivKey'>
                <span>Connect From PrivateKey</span>
                <input type='text' value={fromPriv} onChange={
                    (e)=> setFromPriv(e.target.value)
                }></input>            
                <Button variant="outline-primary" onClick={
                    ()=>connectFromPriv(fromPriv)
                }>Connect</Button>
            </div>
            <div className='connectFromMnemonic'>
                <span>Connect From Mnemonic</span>
                    <input type='text' value={fromMnemonic} 
                    onChange={(e)=> setFromMnemonic(e.target.value)
                    }></input>            
                    <Button variant="outline-primary" onClick={
                        ()=>connectFromMnemonic(fromMnemonic)
                    }>Connect</Button>
            </div>
        </div>
        :
        <div className="completeWrapper">
            connected<br/><br/>
            Network: {selectedNetwork}<br/>
            Address: {currentAddress}<br/>
            Balance: {balance} <br/>
            <Button variant="outline-primary" onClick={()=>logOut()}>log out</Button>
            <Link to="/"><Button variant="outline-primary">Home</Button></Link>
        </div>}
    </div>
    )
}
export default ConnectWallet;