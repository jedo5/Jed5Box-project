import { useState } from 'react';
import './ConnectWallet.css'
import Button from 'react-bootstrap/esm/Button';
import Web3 from 'web3';
import { Link } from 'react-router-dom';

const ConnectWallet = () =>{
    const [to,setTo] = useState('');
    const [connected, setconnected]= useState(false);

    const connectMetamask = async() =>{
        if (typeof window.ethereum !== 'undefined'){
            try{
                const web = new Web3(window.ethereum);
                let accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                })
                console.log(accounts[0]);
                setconnected(true);
            }catch(err){
                console.log(err)
            }
        }else{
            console.log("install metamask")
        }
    }
    const logOut = ()=>{
        if (connected){
            setconnected(false);
        }
    }
    return (
        <div>{!connected ?
        <div className="walletConnectForm">
            <div className='connect3rdParty'>
                <Button variant="outline-primary" onClick={
                    connectMetamask
                }>Connect Metamask</Button>
            </div>
            <div className='connectFromPrivKey'>
                <span>Connect From PrivateKey</span>
                <input type='text' value={to} onChange={
                    (e)=> setTo(e.target.value)
                }></input>            
                <Button variant="outline-primary">Connect</Button>
            </div>
            <div className='connectFromMnemonic'>
                <span>Connect From Mnemonic</span>
                    <input type='text' value={to} onChange={
                        (e)=> setTo(e.target.value)
                    }></input>            
                    <Button variant="outline-primary">Connect</Button>
            </div>
        </div>
        :
        <div>
            connected
            <Button variant="outline-primary" onClick={()=>logOut()}>log out</Button>
            <Link to="/"><Button variant="outline-primary">Home</Button></Link>
        </div>}
    </div>
    )
}
export default ConnectWallet;