import './NFTs.css';
import Theme from "../component/Theme";

const NFTs = () =>{
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
            </div>

        </div>
    )
}

export default NFTs