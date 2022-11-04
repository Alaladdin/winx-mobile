import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);

    return true;
  } catch {
    return false;
  }
}

export async function load(key: string, defaultValue: any = null): Promise<any | null> {
  try {
    const savedValue = await AsyncStorage.getItem(key);

    return savedValue ? JSON.parse(savedValue) : defaultValue;
  } catch {
    return null;
  }
}

export async function save(key: string, value: any): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch {
    return false;
  }
}

export async function remove(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}

export async function clear(): Promise<boolean> {
  try {
    await AsyncStorage.clear();

    return true;
  } catch {
    return false;
  }
}
