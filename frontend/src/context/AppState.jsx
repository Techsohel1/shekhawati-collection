import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sc_token') || '');
  const [authLoading, setAuthLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState([]);

  // Compare State
  const [compareList, setCompareList] = useState([]);

  // Toast notification state
  const [alert, setAlert] = useState(null);

  // Trigger alert helper
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Sync user profile if token exists on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
      setAuthLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  // Load Cart & Wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sc_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedWishlist = localStorage.getItem('sc_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Sync Cart changes to localStorage
  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('sc_cart', JSON.stringify(newCart));
  };

  // Sync Wishlist to localStorage
  const saveWishlistToStorage = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('sc_wishlist', JSON.stringify(newWishlist));
  };

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sc_token', data.token);
      showAlert(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sc_token', data.token);
      showAlert(`Account created successfully! Welcome, ${data.user.name}.`, 'success');
      return { success: true };
    } catch (err) {
      showAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('sc_token');
    showAlert('Successfully logged out.', 'info');
  };

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item._id === product._id);
    let newCart = [...cart];
    
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : '',
        category: product.category,
        quantity: quantity
      });
    }
    
    saveCartToStorage(newCart);
    showAlert(`Added "${product.name}" to cart.`, 'success');
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    saveCartToStorage(newCart);
    showAlert('Removed item from cart.', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item._id === product._id);
    let newWishlist;
    if (exists) {
      newWishlist = wishlist.filter(item => item._id !== product._id);
      showAlert(`Removed "${product.name}" from wishlist.`, 'info');
    } else {
      newWishlist = [...wishlist, product];
      showAlert(`Added "${product.name}" to wishlist.`, 'success');
    }
    saveWishlistToStorage(newWishlist);
  };

  // Compare Functions
  const toggleCompare = (product) => {
    const exists = compareList.some(item => item._id === product._id);
    if (exists) {
      setCompareList(compareList.filter(item => item._id !== product._id));
      showAlert(`Removed "${product.name}" from comparison.`, 'info');
    } else {
      if (compareList.length >= 3) {
        showAlert('You can compare a maximum of 3 products side-by-side.', 'error');
        return;
      }
      setCompareList([...compareList, product]);
      showAlert(`Added "${product.name}" to comparison.`, 'success');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <AppContext.Provider value={{
      user, token, authLoading, login, signup, logout, setUser,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      wishlist, toggleWishlist,
      compareList, toggleCompare, clearCompare,
      alert, showAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
