import Smartlook, {Properties, SmartlookAndroidClassSensitivity, SmartlookIOSClassSensitivity} from 'react-native-smartlook-analytics';

const isEnabled = !__DEV__;

class SmartlookService {
  private initialized = false;
  private eventQueue: (() => void)[] = [];

  init(projectKey: string) {
    if (!isEnabled || this.initialized) return;

    // Validate project key before initialization
    if (!projectKey || projectKey.trim() === '') {
      console.error(
        'Smartlook init error: Project key is missing or empty. Please ensure SMARTLOOK_PROJECT_ID is set in your environment variables.'
      );
      return;
    }

    try {
      Smartlook.instance.preferences.setProjectKey(projectKey);
      Smartlook.instance.start();

      // Disable hiding of text inputs (show them in recording)
      Smartlook.instance.sensitivity.changePlatformClassSensitivity([
        [SmartlookIOSClassSensitivity.UITextField, false],
        [SmartlookIOSClassSensitivity.UITextView, false],
        [SmartlookAndroidClassSensitivity.EditText, false],
      ]);

      this.initialized = true;

      this.eventQueue.forEach(fn => fn());
      this.eventQueue = [];

      console.info('Smartlook started successfully with project key:', projectKey.substring(0, 8) + '...');
    } catch (e) {
      console.error('Smartlook init error:', e);
    }
  }

  private safeCall(fn: () => void, methodName: string) {
    try {
      fn();
    } catch (e) {
      console.error(`Smartlook ${methodName} error:`, e);
    }
  }

  trackScreen(screenName: string) {
    if (!screenName) return;
    // Silently return if Smartlook is disabled (e.g., in dev mode)
    if (!isEnabled) return;

    const call = () => Smartlook.instance.analytics.trackNavigationEnter(screenName);
    if (!this.initialized) {
      this.eventQueue.push(call);
      return;
    }
    this.safeCall(call, 'trackScreen');
  }

  trackEvent(eventName: string, properties?: Properties) {
    if (!eventName) return;
    // Silently return if Smartlook is disabled (e.g., in dev mode)
    if (!isEnabled) return;

    const call = () => Smartlook.instance.analytics.trackEvent(eventName, properties);
    if (!this.initialized) {
      this.eventQueue.push(call);
      return;
    }
    this.safeCall(call, 'trackEvent');
  }

  identifyUser(id: string, email?: string, name?: string) {
    // Silently return if Smartlook is disabled (e.g., in dev mode)
    if (!isEnabled) return;

    const call = () => {
      Smartlook.instance.user.setIdentifier(id);
      if (email) Smartlook.instance.user.setEmail(email);
      if (name) Smartlook.instance.user.setName(name);
    };
    if (!this.initialized) {
      console.warn('identifyUser called before Smartlook init');
      return;
    }
    this.safeCall(call, 'identifyUser');
  }

  resetUser() {
    // Silently return if Smartlook is disabled (e.g., in dev mode)
    if (!isEnabled) return;

    const call = () => {
      Smartlook.instance.user.openNewUser();
      Smartlook.instance.user.openNewSession();
      console.info('Smartlook user reset');
    };
    if (!this.initialized) return;
    this.safeCall(call, 'resetUser');
  }
}

export default new SmartlookService();
