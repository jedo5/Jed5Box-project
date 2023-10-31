import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Main from './pages/Main';
import Mint from './pages/Mint';
import NFTs from './pages/NFTs';
import MyPage from './pages/MyPage';
import ConnectWallet from './pages/ConnectWallet';

import Header from './component/Header';
import Footer from './component/Footer';
import { useEffect, useState } from 'react';
import Web3 from 'web3';



function App() {
  const [web3, setWeb3] = useState(new Web3(window.ethereum));
  const [currentNetwork, setCurrentNetwork] = useState();
  const [currentAdress, setCurrentdress] = useState();
  
  const web3Provider = (provider) =>{
    setWeb3(web3.setProvider(provider));
  }
  const getCurrentInfo = async() =>{
    const networkId = await web3.eth.getChainId()
    const accounts = await web3.eth.getAccounts();
    return {networkId: networkId, address: accounts[0]};
  }

  const setWeb3Props = (web3) =>{
    setWeb3(web3);
  }
  useEffect(()=>{
    if (typeof window.ethereum !== 'undefined'){
      try{
          const web = new Web3(window.ethereum);
          setWeb3(web);
      }catch (err){
        console.log(err);
      }
    }
  },[])

  return (
    <BrowserRouter>
      <Header />
      <div className='content'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/connectWallet" 
            element={<ConnectWallet setWeb3={setWeb3Props}/>}/>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
