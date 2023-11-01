import { useState } from 'react';
import './NFT.css';
import Image from 'react-bootstrap/Image';


const NFT = ({nft}) =>{
  const [clicked, setClicked] = useState(false);
  const handleClick = () =>{
    if (clicked){ setClicked(false); return;}
    setClicked(true);
  }

  
  return (
    <div className="imageForm">
        <Image className="nftImage" src={nft.tokenURI} 
          onClick={handleClick}
          style={{opacity: clicked? '0.2': '1'}} thumbnail >
          </Image>
        <div className='nftMetadata'>
            Token : {nft.name} ({nft.symbol})<br/>
            TokenId : {nft.tokenId}<br/>
            TokenURI : {nft.tokenURI}<br/>
        </div>  
    </div>
    )
}

export default NFT;