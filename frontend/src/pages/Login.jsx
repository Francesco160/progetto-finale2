import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
    login(res.data); 
  } catch (err) {
    alert(err.response?.data?.message || 'Errore login');
  }
};


  return (
    <Container className="login-container">
      <h2 className="mb-4 label-blue">Accedi al tuo account</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label className="label-blue">Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Inserisci email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label className="label-blue">Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Inserisci password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="login-input"
          />
        </Form.Group>

        <Button type="submit" className="btn-login mt-4 w-100">Accedi</Button>
      </Form>
    </Container>
  );
};

export default Login;
