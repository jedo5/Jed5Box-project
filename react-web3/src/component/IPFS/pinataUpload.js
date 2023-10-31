import { useState } from 'react';
import axios from 'axios';
const JWT = process.env.REACT_APP_PINATA_JWT;


const FileUpload = ({mintButton})=>{
    const [selectedFile, setSelectedFile] = useState();
    
    const changeHandler = (event)=>{
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmission = async()=>{
        const formData = new FormData();
        formData.append('file', selectedFile)

        const metadata = JSON.stringify(/*사용자입력데이터*/)
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({cidVersion: 0,});
        formData.append('pinataOptions', options);
        
        try{
            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        Authorization: JWT
                    }
                });
                console.log(res.data);
        }catch(error){
            console.log(error);
        }
    };

    return (
        <div sytle={`"flex-direction": "column"`}>
        <label class="form-label">Choose File</label>
        <input type="file"  onChange={changeHandler}/>
        <button onClick={handleSubmission}>Submit</button>
        </div>
    )
}

export default FileUpload