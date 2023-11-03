import Toast from 'react-bootstrap/Toast';

const Toasts = ({title, data}) => {
  return (
    <Toast>
      <Toast.Header>
        <strong className="me-auto">{title}</strong>
        <small>success!</small>
      </Toast.Header>
      <Toast.Body>{data}</Toast.Body>
    </Toast>
  );
}

export default Toasts;