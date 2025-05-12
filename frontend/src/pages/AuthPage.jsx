import { useState } from 'react';
import './AuthPage.css';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(isLogin ? 'Login data:' : 'Register data:', formData);
      setAuthSuccess(true);
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setAuthSuccess(false);
  };

  if (authSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-success">
          <h2>Success!</h2>
          <p>{isLogin ? 'You have successfully logged in!' : 'Your account has been created!'}</p>
          <button onClick={() => setAuthSuccess(false)} className="auth-button">
            Back to {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={toggleAuthMode} className="toggle-button">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;