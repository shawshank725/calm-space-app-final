import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';

export type PermissionType = 'location' | 'notifications' | 'camera';

export const usePermissions = () => {
  const [isRationaleVisible, setIsRationaleVisible] = useState(false);

  const checkPermissionStatus = useCallback(async (type: PermissionType) => {
    let status: Notifications.PermissionStatus = 'undetermined' as Notifications.PermissionStatus;

    try {
      if (type === 'location') {
        const result = await Location.getForegroundPermissionsAsync();
        status = result.status as unknown as Notifications.PermissionStatus;
      } else if (type === 'notifications') {
        const result = await Notifications.getPermissionsAsync();
        status = result.status;
      } else if (type === 'camera') {
        status = 'undetermined' as Notifications.PermissionStatus;
      }
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
    }

    return { status };
  }, []);

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    try {
      let status: Notifications.PermissionStatus = 'undetermined' as Notifications.PermissionStatus;
      let canAskAgain = true;

      if (type === 'location') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status as unknown as Notifications.PermissionStatus;
        canAskAgain = result.canAskAgain;
      } else if (type === 'notifications') {
        const result = await Notifications.requestPermissionsAsync();
        status = result.status;
        canAskAgain = result.canAskAgain;
      }

      if (status === ('granted' as Notifications.PermissionStatus)) {
        return true;
      }

      if (!canAskAgain) {
        Alert.alert(
          'Permission Required',
          `You have permanently denied ${type} permissions. Please enable them in your device settings to use this feature.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }

      return false;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return false;
    }
  }, []);

  return {
    isRationaleVisible,
    setIsRationaleVisible,
    requestPermission,
    checkPermissionStatus,
  };
};
