import crashlytics from '@react-native-firebase/crashlytics';

export const reportCrash = (error: Error) => {
  if (__DEV__) {
    console.error(error);
    console.tron.log(error);
  } else {
    crashlytics().recordError(error);
  }
};
