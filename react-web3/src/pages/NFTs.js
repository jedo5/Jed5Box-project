import './NFTs.css';
import Theme from "../component/Theme";
import NFT from '../component/NFT';
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import { useEffect, useState } from 'react';


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
        for (let i=1;i<=totalSupply;i++){
            arr.push(i);
        }
        let lists=[]
        for (let tokenId of arr){
            let tokenURI = await contract.methods.tokenURI(tokenId).call();
            lists.push({name,symbol,tokenId, tokenURI})
        }
        setNFTLists(lists);
    }
    useEffect(()=>{
        GetAllNFT();
    },[])

    return (
        <div className="container">
            <div className="theme-container">
                {/* NFT 전부 불러와서 Theme 목록 가져오고 map((theme)=>) 
                <Theme name={theme}/>
                */}theme1 theme2 theme3

            </div>
            <div className="nfts-container">
                {/* NFT 전부 불러와서 Theme 목록 가져오고 map((nft)=>) 
                <NFT name={nft}/>
                */}
                {NFTLists.map((nft)=>{
                    return <NFT key={nft.tokenId} nft={nft}/>
                })}
            </div>

        </div>
    )
}

export default NFTs