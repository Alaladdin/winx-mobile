import crashlytics from '@react-native-firebase/crashlytics';

export const reportCrash = (error: any) => {
  if (__DEV__) {
    console.error(error);
    console.tron.log(error);
  } else {
    crashlytics().recordError(error);
  }
};
