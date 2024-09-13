import {PyBridge} from 'pybridge';

const pythonBridge = new PyBridge({
  python: 'python3', // path to your Python executable
  pythonPath: './', // path to your Python scripts
});

export default pythonBridge;
