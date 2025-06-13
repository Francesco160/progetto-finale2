import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/custom.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess(res.data.message);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Errore durante la registrazione');
    }
  };

  return (
    <Container className='form-container' style={{ maxWidth: '500px', marginTop: '40px' }}>
      <h2 className="label-blue">Registrati</h2>
      {error && <Alert className="alert-red">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label className="label-blue">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="label-blue">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Inserisci email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="label-blue">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Inserisci password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label className="label-blue">Conferma Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Conferma password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={6}
            required
          />
        </Form.Group>

        <Button className="btn-blue w-100" type="submit">
          Registrati
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
