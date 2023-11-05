import './NFTs.css';
import Theme from "../component/Theme";
import NFT from '../component/NFT';
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import { useEffect, useState } from 'react';
import axios from 'axios';


const NFTs = ({web3}) =>{
    const [NFTLists, setNFTLists] = useState([]);

    const GetAllNFT = async() =>{
        const contract = await new web3.eth.Contract(
            JedoBoxABI, process.env.REACT_APP_JEDOBOX_ADDRESS
        );
        
        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const totalSupply = await contract.methods.totalSupply().call();
        
        let arr = [];
        for (let i=0;i<totalSupply;i++){
            const index = await contract.methods.tokenByIndex(i).call();
            arr.push(index);
        }
        
        let lists=[]
        for (let tokenIdN of arr){
            let tokenURI = await contract.methods.tokenURI(tokenIdN).call();
            const tokenId = Number(tokenIdN);
            console.log(tokenId)
            const nftJson = await axios.get(tokenURI);
            const nftInfo = nftJson.data;
            lists.push({name,symbol,tokenId, nftInfo});
        }
        setNFTLists(lists);
    }
    useEffect(()=>{
        if (web3){
            GetAllNFT();
        }
    },[web3])

    return (
        <div className="container">
            <div className="theme-container">
                [ All ]   [ Cat ]   [ Dog ]
            </div>
            <div className="nfts-container">
                {NFTLists.map((nft)=>{
                    return <figure><NFT key={nft.tokenId} nft={nft}/></figure>
                })}
            </div>

        </div>
    )
}

export default NFTs