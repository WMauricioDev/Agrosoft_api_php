import React, { useState, FormEvent } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register: React.FC = () => {
  const [identificacion, setIdentificacion] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [areaDesarrollo, setAreaDesarrollo] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!identificacion || !nombre || !apellido || !fechaNacimiento || !email || !password) {
      setError('Los campos marcados con * son requeridos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost/agrosoft_php/usuario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identificacion: parseInt(identificacion),
          nombre, 
          apellido, 
          fecha_nacimiento: fechaNacimiento,
          telefono,
          email, 
          password,
          area_desarrollo: areaDesarrollo,
          fk_rol: 1  
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Error en el registro');
      }

      setSuccess('Usuario registrado correctamente');
    } catch (err) {
      setError((err as Error).message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease-in-out',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#2ecc71' },
      '& .MuiInputAdornment-root': {
        backgroundColor: 'inherit',
        height: '100%',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#a0aec0',
      '&.Mui-focused': { color: '#2ecc71' },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        width: '100%',
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <TextField
            label="Identificación *"
            type="number"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <TextField
            label="Fecha de Nacimiento *"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={textFieldStyles}
          />
        </motion.div>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <TextField
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <TextField
            label="Apellido *"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            fullWidth
            required
            sx={textFieldStyles}
          />
        </motion.div>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <TextField
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
            sx={textFieldStyles}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
          <TextField
            label="Área de Desarrollo"
            value={areaDesarrollo}
            onChange={(e) => setAreaDesarrollo(e.target.value)}
            fullWidth
            sx={textFieldStyles}
          />
        </motion.div>
      </Box>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.2 }}>
        <TextField
          type="email"
          label="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={textFieldStyles}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.4 }}>
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Contraseña *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
      </motion.div>

      {error && (
        <Typography variant="body2" sx={{ color: '#f56565', textAlign: 'center', fontSize: '0.875rem' }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" sx={{ color: '#2ecc71', textAlign: 'center', fontSize: '0.875rem' }}>
          {success}
        </Typography>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.6 }}>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          fullWidth
          sx={{ backgroundColor: '#2ecc71' }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </motion.div>

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem', mt: 1 }}
      >
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: '#27a35e', textDecoration: 'none' }}>
          Iniciar sesión
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;