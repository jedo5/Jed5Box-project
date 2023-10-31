import './Mint.css';
import FileUpload from '../component/IPFS/pinataUpload';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';

const Mint = () =>{
    const [selectedFile, setSelectedFile] = useState();
    const [name, setname] = useState('');
    const [description, setDescription] = useState('');

    const handleFileUpload = (event) =>{
        const file=event.target.files[0];
        const reader = new FileReader();

        reader.onload = () =>{
            setSelectedFile(reader.result)
        };
        if (file){
            reader.readAsDataURL(file);
        }
    };

    const handleMetadata = (event, idx)=>{
        const value = event.target.value;
        if(idx === 1){
            setname(value);
        }
        if(idx ===2){
            setDescription(value);
        }
    }
    const handleMint = () =>{
        console.log(name, description);
        //pinata
    }

    return (
        <div className="mint-container">
            <span> Minting NFT</span>
            <div className="mintingForm">
                <div className="nft-metadata-form">
                    <div className="nft-image">
                        {!selectedFile && (
                            <div>
                            <label className="form-label">Choose File</label>
                            <input type="file" onChange={handleFileUpload}/>
                            </div>
                        )}
                        <img src={selectedFile} style={{width: '100%', height: '100%'}}/>
                    </div>
                    <div className='nft-metadata'>
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e)=>handleMetadata(e,1)} style={{width: '90%'}}></input><br/>
                        <label>Description</label>
                        <input type="text" value={description} onChange={(e)=>handleMetadata(e,2)} style={{width: '90%'}}></input><br/>
                    </div>
                </div>
                <Button onClick={handleMint} variant="outline-primary">Mint</Button>
            </div>
        </div>
    )
}

export default Mint