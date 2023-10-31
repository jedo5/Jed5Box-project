import nfts from '../nft_example.json';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const NFT = () =>{
    const ex1 = nfts[0];
    console.log(ex1)
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={ex1.image} />
        <img src={ex1.image} />
        <Card.Body>
          <Card.Title>NFT Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    )
}

export default NFT;