import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import Web3 from 'web3';



const Header = ({web3}) =>{
      const [myInfo, setMyInfo] = useState([]);
      let account;
      let getBal;
      const getMyAccount = async()=>{
        if (window.ethereum){
          account = await window.ethereum.request({
            "method": "eth_requestAccounts",
            "params": []
        })
        account = account[0];
        console.log(account)
          getBal = await window.ethereum.request({
            "method": 'eth_getBalance',
            "params": [
                account
            ]
          })
        }else{
          account = await web3.eth.accounts.wallet[0].address;
          console.log('header(account):',account);
          getBal = await web3.eth.getBalance(account);
        }
        const network = await web3.eth.getChainId();
        console.log('fromHeader: '+network)
        const balance = web3.utils.fromWei(getBal,"ether");
        setMyInfo([account,balance,network]);
      }
    useEffect(()=>{
      if (!web3) setMyInfo(['Undefined','Undefined','Undefined'])
      else getMyAccount();
    },[web3]);

    console.log('header-',web3)
    return (
        <header>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">JED5BOX</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav style={{alignItems: "center"}} className="me-auto">
                <Nav.Link href="/nfts">NFTs</Nav.Link>
                <Nav.Link href="/mint">Mint</Nav.Link>
                <Nav.Link href="/mypage" style={{width: "110px"}}>My page</Nav.Link>
                <Nav.Link href="/connectWallet" style={{width: "100px"}}>Log in</Nav.Link>
                <Nav.Link style={{marginLeft:"150px"}}>{`account: ${myInfo[0]}`}</Nav.Link>
                <Nav.Link style={{marginLeft:"10px"}}>{`balance: ${myInfo[1]}`}</Nav.Link>
                <Nav.Link>{`network: ${myInfo[2]}`}</Nav.Link>
              </Nav>

            </Navbar.Collapse>
          </Container>
        </Navbar>
        </header>
    );
}

export default Header