import './Main.css'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


const Main = () =>{
    return (
        <div className="enterBox-container">
            <div className="enterBox">
                Welcome to JED5Box NFT BOX<br/><br/>
                <Link to="/nfts">
                    <Button variant="outline-primary">Enter</Button>
                </Link>
            </div>
        </div>
    )
}

export default Main