import './Mint.css';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import JedoBoxABI from '../component/blockchain/contractABIJedoBox.json';
import Toasts from '../component/Toasts';

const pinataJWT = process.env.REACT_APP_PINATA_JWT;


const Mint = ({web3}) =>{
    const [selectedFile, setSelectedFile] = useState();
    const [name, setname] = useState('');
    const [description, setDescription] = useState('');
    const [species, setSpecies] = useState('');
    const [color, setColor] = useState('');
    const [background, setBackground] = useState('');
    const [file, setFile] = useState();
    const [minting, setMinting] = useState(false);
    const [minted, setMinted] = useState(false);
    const [nftHash, setNFTHash] = useState('');
    const [contractHash, setContractHash] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
        setMinting(true);
        setIsButtonDisabled(true);
        //ipfs 업로드
        let formData = new FormData();
        formData.append('file', file)

        let metadata = JSON.stringify({
            name: name,
        })
        formData.append('pinataMetadata', metadata);

        let options = JSON.stringify({cidVersion: 0,});
        formData.append('pinataOptions', options);
        let imageIpfsHash;

        //이미지 업로드
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
            "image": `https://ipfs.io/ipfs/${imageIpfsHash}`,
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
        //메타데이터 업로드
        metadata = JSON.stringify(data);
        let nftURI;
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
                nftURI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
                setNFTHash(nftURI);

        }catch(error){
            console.log(error);
        }

        //contract에 배포
        const myAddress = (await web3.eth.getAccounts())[0];
        const tokenURI = nftURI;
        const contract = await new web3.eth.Contract(
            JedoBoxABI, process.env.REACT_APP_JEDOBOX_ADDRESS, {from:myAddress}
        );
        const estimateGasAmount = await contract.methods.mintNFT(myAddress,tokenURI).
            estimateGas({from: myAddress, gas:500000}).catch((err)=>{console.log(err);});
        const txData = await contract.methods.mintNFT(myAddress,tokenURI).encodeABI();

        try{
            const sendTX = await web3.eth.sendTransaction({
                from: myAddress,
                to: process.env.REACT_APP_JEDOBOX_ADDRESS,
                gas: estimateGasAmount,
                gasPrice: await web3.eth.getGasPrice(),
                data: txData
            });
            setContractHash(sendTX.blockHash);
            console.log(sendTX);
            setSelectedFile();
            setname('');
            setDescription('');
            setSpecies('');
            setColor('');
            setBackground('');
            setMinting(false);
            setMinted(true);
            setIsButtonDisabled(false);
        }catch(err){
            console.error(err);
        }

    }

    return (
        <div className="mint-container">
            <span> Minting NFT</span>
            <div className="mintingForm">
                <div className="nft-metadata-form">
                    <div className="nft-image-form">
                        {!selectedFile && (
                            <div>
                            <label className="form-label">Choose File</label>
                            <input type="file" onChange={handleFileUpload}/>
                            </div>
                        )}
                        <img src={selectedFile} className='nft-img'/>
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
                <Button onClick={handleMint} className="mintButton" variant="outline-primary" disabled={isButtonDisabled}>
                    {minting? 
                        <div className="loader loader-1"></div>
                        : <span>Mint</span>
                    }
                </Button>
            </div>
            {minted?
                    <>
                        <Toasts title={'IPFS upload'} data={'URI: '+nftHash} />
                        <Toasts title={'Deploy NFT'} data={'TX HASH: '+contractHash}/>
                    </>:<></>
            }
        </div>
    )
}

export default Mint