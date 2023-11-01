import './Mint.css';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';

const pinataAPI = process.env.REACT_APP_PINATA_API_KEY;
const pinataAPIsecret = process.env.REACT_APP_PINATA_API_SECRET;
const pinataJWT = process.env.REACT_APP_PINATA_JWT;


const Mint = () =>{
    const [selectedFile, setSelectedFile] = useState();
    const [name, setname] = useState('');
    const [description, setDescription] = useState('');
    const [species, setSpecies] = useState('');
    const [color, setColor] = useState('');
    const [background, setBackground] = useState('');
    const [file, setFile] = useState();

    const handleFileUpload = (event) =>{
        const file=event.target.files[0];
        const reader = new FileReader();

        reader.onload = () =>{
            setSelectedFile(reader.result)
            setFile(file);
        };
        if (file){
            reader.readAsDataURL(file);
        }
    };

    const handleMetadata = (event, idx)=>{
        const value = event.target.value;
        switch(idx){
            case 1:
                setname(value);
                break;
            case 2:
                setDescription(value);
                break;
            case 3:
                setSpecies(value);
                break;
            case 4:
                setColor(value);
                break;
            case 5:
                setBackground(value);
        }
    }
    const handleMint = async() =>{
        let formData = new FormData();
        formData.append('file', file)

        let metadata = JSON.stringify({
            name: name,
        })
        formData.append('pinataMetadata', metadata);

        let options = JSON.stringify({cidVersion: 0,});
        formData.append('pinataOptions', options);
        let imageIpfsHash;
        try{
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        Authorization: `Bearer ${pinataJWT}`
                    }
                });
                imageIpfsHash=res.data.IpfsHash;
        }catch(error){
            console.log(error);
        }

        const data = {
            "name": name,
            "description": description,
            "image": `ipfs://${imageIpfsHash}`,
            "attributes": [
                {
                    "trait_type": "species",
                    "value": species
                },
                {
                    "trait_type": "color",
                    "value": color
                },
                {
                    "trait_type": "background",
                    "value": background
                }
            ]
        }
        metadata = JSON.stringify(data);
        console.log(metadata);
        
        try{
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                metadata,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': `application/json`,
                        Authorization: `Bearer ${pinataJWT}`
                    }
                });
                console.log(res.data);
                setSelectedFile();
                setname('');
                setDescription('');
                setSpecies('');
                setColor('');
                setBackground('');
                alert(res.data.IpfsHash);
        }catch(error){
            console.log(error);
        }
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
                        <label>Species</label>
                        <input type="text" value={species} onChange={(e)=>handleMetadata(e,3)} style={{width: '90%'}}></input><br/>
                        <label>Color</label>
                        <input type="text" value={color} onChange={(e)=>handleMetadata(e,4)} style={{width: '90%'}}></input><br/>
                        <label>Background: inside | outside</label>
                        <input type="text" value={background} onChange={(e)=>handleMetadata(e,5)} style={{width: '90%'}}></input><br/>
                    </div>
                </div>
                <Button onClick={handleMint} variant="outline-primary">Mint</Button>
            </div>
        </div>
    )
}

export default Mint