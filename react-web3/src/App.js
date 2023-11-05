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
  const [web3, setWeb3] = useState();

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
    }else{
      alert('install metamask')
    }
  },[])
  console.log('App.js -',web3);

  return (
    <BrowserRouter>
      <Header web3={web3}/>
      <div className='content'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/nfts" element={<NFTs web3={web3} />} />
          <Route path="/mint" element={<Mint web3={web3}/>} />
          <Route path="/mypage" element={<MyPage web3={web3}/>} />
          <Route path="/connectWallet" 
            element={<ConnectWallet setWeb3={setWeb3Props}/>}/>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
