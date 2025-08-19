import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

export function useKeyboard() {
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, e => {
      setKeyboardShown(true);
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardShown(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return {keyboardShown};
}
