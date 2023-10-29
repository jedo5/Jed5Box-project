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



function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className='content'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/connectWallet" element={<ConnectWallet />}/>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
