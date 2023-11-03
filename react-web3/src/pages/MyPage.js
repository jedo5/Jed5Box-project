import './MyPage.css'
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import axios from 'axios';
import Caver from 'caver-js';



const MyPage = ({web3}) =>{
    const caver = new Caver(new Caver.providers.HttpProvider(process.env.REACT_APP_KLAYTN_BAOBAB));
    const JEDOBOX = new caver.klay.Contract(JedoBoxABI, process.env.REACT_APP_JEDOBOX_ADDRESS);

    const getNFTsBy = async()=>{
        const web3Account = await web3.eth.getAccounts()

        const address = web3Account[0];
        const options = {
            auth: {
              username: process.env.REACT_APP_KLAYTN_ACCESS_ID,
              password: process.env.REACT_APP_KLAYTN_ACCESS_SECRET,
            },
            headers: {
              "Content-Type": `application/json`,
              "x-chain-id": "1001",
            },
        };
        const url= `https://th-api.klaytnapi.com/v2/account/${address}/token`
        const nftsByKas = await axios.get(url, options).then((res)=>{
            return res.data.items;
        })

        for (let i = 0; i < nftsByKas.length; i++) {
            if (nftsByKas[i].kind !== "nft") {
              continue;
            } else {
              const nftInfo = {};
              const timeStamp = new Date(nftsByKas[i].updatedAt);
                
              nftInfo.contractAddress = nftsByKas[i].contractAddress;
              nftInfo.tokenId = await web3.utils.hexToNumber(nftsByKas[i].extras.tokenId);
              nftInfo.tokenUri = nftsByKas[i].extras.tokenUri;
              nftInfo.createdAt = timeStamp.toISOString();
              nftInfo.chain = "Klaytn Baobab";
              nftInfo.transactionHash = nftsByKas[i].lastTransfer.transactionHash;
            }
        }
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