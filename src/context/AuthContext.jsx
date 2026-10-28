import { createContext, useContext, useEffect, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  currentUser: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        currentUser: action.payload,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

function getSavedAuthState() {
  const saved = localStorage.getItem('twitter-auth');

  if (!saved) return initialState;

  try {
    return JSON.parse(saved);
  } catch {
    return initialState;
  }
}

export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, getSavedAuthState());

  useEffect(() => {
    localStorage.setItem('twitter-auth', JSON.stringify(auth));
  }, [auth]);

  const login = (user) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
