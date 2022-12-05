import { Linking } from 'react-native';
import { reportCrash } from '@/utils/crash-reporting';

/**
 * Helper for opening a give URL in an external browser.
 */
export function openLinkInBrowser(url: string) {
  // Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));

  Linking.openURL(url)
    .catch(reportCrash);
}
