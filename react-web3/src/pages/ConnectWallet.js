import './ConnectWallet.css'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Web3 from 'web3';
import {ethers} from 'ethers';


const ConnectWallet = ({setWeb3}) =>{
    const [currentWeb3, setCurrentWeb3] = useState(new Web3(window.ethereum));
    const [fromPriv,setFromPriv] = useState('');
    const [fromMnemonic, setFromMnemonic] = useState('');
    const [connected, setconnected]= useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState("Ethereum-Goerli");
    const [networkURL, setNetworkURL] = useState(process.env.REACT_APP_INFURA_ETH_GOERLI);
    const [currentAddress, setCurrentAddress]= useState('');
    const [balance, setBalance] = useState('');


    const connectMetamask = async() =>{
        const web = new Web3(window.ethereum);
        const chainId = await window.ethereum.request({
            "method": 'eth_chainId'
        });
        if (chainId === '0x5') {setSelectedNetwork('Ethereum-Goerli');}
        if (chainId === '0x13881') {setSelectedNetwork('Polygon-Mumbai');}
        if (chainId ===  '0x3e9') {setSelectedNetwork('Klaytn-Baobab');}
        if (chainId === '0x539') {setSelectedNetwork('Localhost');}
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
        setWeb3(web)
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
        const web = new Web3(new Web3.providers.HttpProvider(networkURL));
        const accounts = web.eth.accounts.privateKeyToAccount('0x'+priv);
        setCurrentAddress(accounts.address);
        setCurrentWeb3(web);   
        setWeb3(web);
        setconnected(true);
    }

    const connectFromMnemonic = (mnemonic) =>{
        const web = new Web3(new Web3.providers.HttpProvider(networkURL));
        const accounts = ethers.Wallet.fromPhrase(mnemonic, web.currentProvider);
        setCurrentAddress(accounts.address);
        setCurrentWeb3(web);   
        setWeb3(web);
        setconnected(true);
    }
    useEffect(()=>{
        showBalance()
    }, [balance, currentWeb3, currentAddress, selectedNetwork])

    const showBalance = async() =>{
        if(currentAddress==='') return;
        const weiBalance = await currentWeb3.eth.getBalance(currentAddress);
        setBalance(currentWeb3.utils.fromWei(weiBalance, 'ether'));
    }

    const logOut = ()=>{
        if (connected){
            setWeb3(new Web3());
            setFromPriv('');
            setFromMnemonic('');
            setconnected(false);
        }
    }
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