import {Types} from '../Types';
import {login} from '../../services/authServices';
import {identifyUser, anonymizeUser} from '../../services/fullstoryService';

const {
  SIGN_IN,
  CLEAR_INSPECTION_REVIEWED,
  CLEAR_INSPECTION_IN_PROGRESS,
  CLEAR_NEW_INSPECTION,
  SIGN_OUT,
  SESSION_EXPIRED,
} = Types;

export const signIn = (username, password) => async dispatch => {
  await login(username, password)
    .then(res => {
      dispatch({type: SIGN_IN, payload: res});
      
      // Identify user in FullStory after successful login
      // Extract user ID and metadata from response
      // Adjust these fields based on your actual API response structure
      const userId = res?.user?.id || res?.id || res?.userId || username;
      const userEmail = res?.user?.email || res?.email;
      const displayName = res?.user?.name || res?.name || res?.displayName || username;
      
      identifyUser(userId, {
        displayName,
        email: userEmail,
        username: username,
      });
    })
    .catch(error => {
      throw error;
    });
};

export const signOut = () => {
  return dispatch => {
    // Anonymize user in FullStory before clearing session
    anonymizeUser();
    
    dispatch({type: CLEAR_INSPECTION_REVIEWED});
    dispatch({type: CLEAR_INSPECTION_IN_PROGRESS});
    dispatch({type: CLEAR_NEW_INSPECTION});
    dispatch({type: SIGN_OUT});
  };
};

export const sessionExpired = () => {
  // Anonymize user when session expires
  anonymizeUser();
  
  return {
    type: SESSION_EXPIRED,
  };
};
