import PropTypes from 'prop-types';
import React, { useState , useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

// Material-UI imports
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';
// Components
import AnimateButton from 'components/@extended/AnimateButton';

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  useEffect(() => {
    // Recuperar los valores del localStorage cuando el componente se monta
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
  
    if (storedEmail && storedPassword) {
      setValues({ email: storedEmail, password: storedPassword });
      setChecked(true); // Activar el checkbox si se encuentran datos en localStorage
    }
  }, []);
  
  useEffect(() => {
    if (checked) {
      // Guardar en localStorage si el checkbox está activado
      localStorage.setItem('email', values.email);
      localStorage.setItem('password', values.password);
    } else {
      // Borrar del localStorage si el checkbox está desactivado
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }, [checked, values]);

  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values, { setErrors, setSubmitting }) => {
    setLoading(true);
    try {
      const response = await fetch('https://api-reniec-sunat.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email, // Assuming username is passed as email
          password: values.password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.message === 'Logged') {
        // Save token to localStorage or state management
        localStorage.setItem('token', data.token);
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setErrors({ submit: 'Credenciales incorrectas o error en el servidor.' });
      }
    } catch (error) {
      setErrors({ submit: 'Ocurrió un error al intentar iniciar sesión o error en el servidor.' });
    } finally {
      setLoading(false); // Ocultar el indicador de carga
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: localStorage.getItem('email') || '',
        password: localStorage.getItem('password') || '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required('El usuario es obligatorio'),
        password: Yup.string().required('La contraseña es obligatoria'),
      })}
      onSubmit={(values, actions) => {
        if (checked) {
          localStorage.setItem('email', values.email);
          localStorage.setItem('password', values.password);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }
        handleLogin(values, actions);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit,isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Usuario</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                <OutlinedInput
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Ingresa tu contraseña"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Recuérdame</Typography>}
                />
                <RouterLink to="#">
                  <Typography variant="h6" color="text.primary">
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </RouterLink>
              </Stack>
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
                  </Button>
              </AnimateButton>
            </Grid>

            <Grid item xs={12}>
              <Divider>
                <Typography variant="caption">O inicia sesión con</Typography>
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <FirebaseSocial />
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = {
  isDemo: PropTypes.bool,
};