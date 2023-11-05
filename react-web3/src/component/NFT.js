import { useState } from 'react';
import './NFT.css';
import Image from 'react-bootstrap/Image';


const NFT = ({nft}) =>{
  const [clicked, setClicked] = useState(false);
  let imageLink = nft.nftInfo.image;
  console.log(nft.nftInfo)
  const handleClick = () =>{
    if (clicked){ setClicked(false); return;}
    console.log(nft.nftInfo);
    setClicked(true);
  }

  
  return (
    <div className="imageForm">
        <Image className="nftImage" src={imageLink} 
          onClick={handleClick}
          style={{opacity: clicked? '0.2': '1'}} thumbnail >
          </Image>
        <div className='nftMetadata'>
            Token : {nft.name} ({nft.symbol})<br/>
            TokenId : {nft.tokenId}<br/><br/>
            Name: {nft.nftInfo.name}<br/>
            Description: {nft.nftInfo.description}<br/>
            {nft.nftInfo.attributes.map((attr)=>{
              return <> - {attr.trait_type}: {attr.value}<br/></>
            })}
        </div>  
    </div>
    )
}

export default NFT;