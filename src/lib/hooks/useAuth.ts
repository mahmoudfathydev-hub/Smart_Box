import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  signUp, 
  signIn, 
  signOut, 
  clearError, 
  setUser, 
  clearUser,
  SignUpData,
  SignInData
} from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const handleSignUp = async (userData: SignUpData) => {
    return dispatch(signUp(userData));
  };

  const handleSignIn = async (credentials: SignInData) => {
    return dispatch(signIn(credentials));
  };

  const handleSignOut = async () => {
    return dispatch(signOut());
  };

  const handleError = () => {
    dispatch(clearError());
  };

  const setCurrentUser = (user: any) => {
    dispatch(setUser(user));
  };

  const clearCurrentUser = () => {
    dispatch(clearUser());
  };

  return {
    ...auth,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    clearError: handleError,
    setUser: setCurrentUser,
    clearUser: clearCurrentUser,
  };
};
