import './Mint.css';
import Button from 'react-bootstrap/esm/Button';

const Mint = () =>{
    return (
        <div className="mint-container">
            <span> Minting NFT</span>
            <div className="mintingForm">
                <div className="nft-metadata-form">
                    <div className="nft-image">

                    </div>
                    <div className='nft-metadata'>
                        
                    </div>
                </div>
                <Button variant="outline-primary">Mint</Button>
            </div>
        </div>
    )
}

export default Mint