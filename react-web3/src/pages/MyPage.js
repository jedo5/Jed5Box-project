import './MyPage.css'
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import axios from 'axios';
import Caver from 'caver-js';
import { useEffect, useState } from 'react';
import NFT from '../component/NFT';
import Button from 'react-bootstrap/esm/Button';


//Only Klaytn Network 
const MyPage = ({web3}) =>{
    const caver = new Caver(new Caver.providers.HttpProvider(process.env.REACT_APP_KLAYTN_BAOBAB));
    const JEDOBOX = new caver.klay.Contract(JedoBoxABI, process.env.REACT_APP_JEDOBOX_ADDRESS);
    const [myNFTsInfo, setMyNFTsInfo] = useState([]);
    const [myEOAinfo, setMyEOAinfo] = useState([]);
    const [imageInfo, setImageInfo] = useState('');
    const [sending, setSending] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    let myErc721list;
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
    
    const checkCaverConnect = () =>{
        caver.rpc.klay.getClientVersion().then(console.log)
    }
    checkCaverConnect();

    const getMyAccount = async()=>{
        let account, getBal;
        if (window.ethereum){
            account = await web3.eth.getAccounts();
            account = account[0];
        }else{
            account = await web3.eth.accounts.wallet[0].address;
        }
        getBal = await web3.eth.getBalance(account);
        const balance = web3.utils.fromWei(getBal,"ether");
        console.log(balance);

        const url= `https://th-api.klaytnapi.com/v2/account/${account}/token`
        const nftsByKas = await axios.get(url, options).then((res)=>{
            return res.data.items;
        })
   
        myErc721list = nftsByKas.filter((obj)=>{return obj.kind==='nft'})
        console.log(myErc721list)
        const TotalNfts = myErc721list.length;
        setMyEOAinfo([account,balance,TotalNfts])
        return myErc721list;
    }
    const getNFTsAll = async()=>{
        let arr=[];
        const nftLists = await getMyAccount();
        for (let nft of nftLists.slice(0,2)) {
              let contractInfo={};
              contractInfo.contractAddress = nft.contractAddress;
              contractInfo.tokenUri = nft.extras.tokenUri;
              const pinatalinklength = ('https://gateway.pinata.cloud/').length;
              if (contractInfo.tokenUri.substr(0,pinatalinklength)==='https://gateway.pinata.cloud/'){
                contractInfo.tokenUri = "https://ipfs.io/"+contractInfo.tokenUri.substr(pinatalinklength,contractInfo.tokenUri.length);
              }
              const metaURL = await axios.get(contractInfo.tokenUri).then((res)=>{return res.data});
              console.log(metaURL)
              const url = `https://th-api.klaytnapi.com/v2/contract/nft/${nft.contractAddress}`
              const nftContractInfo = await axios.get(url, options).then((res)=>{
                return res.data;
              })

              const name = nftContractInfo.name;
              const symbol = nftContractInfo.symbol
              const tokenId = web3.utils.hexToNumber(nft.extras.tokenId);
              const contentName = metaURL.name;
              const description = metaURL.description;
              const image = metaURL.image;
              const attribute = metaURL.attributes
              const nftInfo = {
                "name": contentName,
                "description":description,
                "image": image,
                "attributes":attribute
            }
              arr.push({name,symbol,tokenId,nftInfo});
              console.log('arr',arr)
        }
        setMyNFTsInfo(arr);
    }
    const clickImage = (clickedImg) =>{
        let targetInfo;
        for (let targetNFT of myNFTsInfo){
            if (targetNFT.nftInfo.image===clickedImg){
                targetInfo=targetNFT;
                break;
            }
        }
        setImageInfo(targetInfo);
    }

    const getImageInfoReturn = (nft) =>{
        console.log('getimagereturn',nft)
        const nftkeys = Object.keys(nft.nftInfo);
        
        return (
            <div className="infoForm">
                <div className="nft-metadata-form">
                    <div className="nft-image-form">
                        <img src={nft.nftInfo.image} className='nft-img'/>
                    </div>
                    <div className='nft-metadata'>
                        {nftkeys.map((baseInfo)=> {return (
                        <>
                            {(baseInfo !== 'attributes')? //name
                            <>
                                <label>{baseInfo}</label>
                                <input type="text" 
                                    value={nft.nftInfo[baseInfo]}
                                    style={{width: '90%'}}></input><br/>
                            </>
                            :
                            <>
                            {nft.nftInfo.attributes.map((attr)=>{ return (
                            <>
                                <label>Trait_type: {attr.trait_type}</label>
                                <input type="text" 
                                    value={attr.value}
                                    style={{width: '90%'}}></input><br/>
                            </>)})}
                            </>
                            }
                        </>)}
                        )}
                    </div>
                </div>
                <Button onClick={handleSending} className="transferButton" variant="outline-primary" disabled={isButtonDisabled}>
                    {sending? 
                        <div className="loader loader-1"></div>
                        : <span>Send</span>
                    }
                </Button>
            </div>
        )
    }
    const handleSending = ()=>{
        isButtonDisabled(true);
    }

    useEffect(()=>{
        if (web3){
            getNFTsAll()
        }
    },[web3])

    return (
        <div className='myPage-container'>
            My Address Info<br/>
            <div className='accountInfo'>
                Address : {myEOAinfo[0]}<br/>
                Balance : {myEOAinfo[1]}<br/>
                TotalNfts : {myEOAinfo[2]}<br/>
            </div>

            <div className='nftInfo'>
                <span>My NFTs</span>
                <div className="listNFTImage">
                    {myNFTsInfo.map((nft, index)=>{
                      return(
                        <div key={index} className="smallNFTForm">
                            <img src={nft.nftInfo.image} onClick={()=>clickImage(nft.nftInfo.image)} className="smallNFTImage"/>
                        </div>
                      )
                    })}
                </div>
                <hr/>
                {(imageInfo ==='')? <></>:getImageInfoReturn(imageInfo)}
            </div>
        </div>
    )
}

export default MyPage