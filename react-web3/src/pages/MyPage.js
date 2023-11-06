import './MyPage.css'
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import axios from 'axios';
import Caver from 'caver-js';
import { useEffect, useState } from 'react';
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
    const [toInput, setToInput] = useState('');
    const [clickedNFT, setClickedNFT] = useState();


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
        for (let nft of nftLists) {
              let contractInfo={};
              console.log(nft);
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
              const CA = nft.contractAddress;
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
              arr.push({CA,name,symbol,tokenId,nftInfo});
              console.log('arr',arr)
        }
        setMyNFTsInfo(arr);
    }
    const clickImage = (clickedImg) =>{
        let targetInfo;
        for (let targetNFT of myNFTsInfo){
            if (targetNFT.nftInfo.image===clickedImg){
                targetInfo=targetNFT;
                setClickedNFT(targetNFT);
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
                        <label style={{marginBottom: "5px", fontWeight: "bold"}}>
                            {`${nft.name}(${nft.symbol}) id:${nft.tokenId}`}
                        </label>
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
                <div className="sendingform">
                <Button onClick={()=>sendToken()} className="transferButton" variant="outline-primary" disabled={isButtonDisabled}>
                    {sending? 
                        <div className="loader loader-1"></div>
                        :<div className="">
                            <span>Send</span>
                        </div>
                    }
                </Button>
                {sending?
                <><span>Processing...</span></>
                :<span style={{marginTop:"10px"}}>To: <input type="text" value={toInput} onChange={(e)=>setToInput(e.target.value)}/></span>
                }
                </div>
            </div>
        )
    }
    const sendToken = async()=>{
        setIsButtonDisabled(true);
        setSending(true);
        console.log(clickedNFT);

        const address = myEOAinfo[0];
        console.log(address);
        const tokenContract = await new web3.eth.Contract(
            JedoBoxABI, process.env.REACT_APP_JEDOBOX_ADDRESS, {from: address}
        );
        console.log('clciked',address,toInput,clickedNFT.tokenId);
        const estimateGasAmount = await tokenContract.methods.safeTransferFrom(address, toInput, clickedNFT.tokenId)
        .estimateGas({from: address, gas:5000000}).catch(function(error){
            console.log(error);
        });
        const txData = await tokenContract.methods.safeTransferFrom(address, toInput, clickedNFT.tokenId)
        .encodeABI();

        await web3.eth.sendTransaction({
            from: address,
            to: process.env.REACT_APP_JEDOBOX_ADDRESS,
            gas: estimateGasAmount,
            gasPrice: await web3.eth.getGasPrice(),
            data: txData
        })
        .on('receipt', (receipt)=>{
            if (receipt.status){
                alert("tx success");
                setToInput("");
            }else{
                console.error("failed");
            }
        })  
        .on("error", (error)=>{
            console.error(error);
        });

        setSending(false);
        setIsButtonDisabled(false);
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