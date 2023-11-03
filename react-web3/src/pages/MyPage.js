import './MyPage.css'
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import axios from 'axios';
import Caver from 'caver-js';



const MyPage = ({web3}) =>{
    const caver = new Caver(new Caver.providers.HttpProvider(prcoess.env.REACT_APP_KLAYTN_BAOBAB));

    const getMyAccountInfo = async()=>{
        const myAddress = await web3.eth.getAccounts()
    }
    
    const getJson = async() =>{
        const json = await axios.get("")
        console.log(json.data);
    }
    // getJson();
    const checkCaverConnect = () =>{
        caver.rpc.klay.getClientVersion().then(console.log)
    }
    checkCaverConnect();

    return (
        <div className='myPage-container'>
            <div className='addressInfo'>
                <span>My Address Info</span>
            </div>
            <div className='nftInfo'>
                <span>My NFT</span>
                {/* 
                    map <Theme />
                    <hr/>
                    map <Button><NFT /></Button>
                        click-> <div className='NFTform'>
                                <div className='NFTtransfer'>
                */}
            </div>
        </div>
    )
}

export default MyPage