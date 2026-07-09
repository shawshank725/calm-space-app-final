import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

function getNotificationsModule() {
  if (isExpoGo) {
    return null;
  }

  return require('expo-notifications') as typeof import('expo-notifications');
}

export type PermissionType = 'location' | 'notifications' | 'camera';

export const usePermissions = () => {
  const [isRationaleVisible, setIsRationaleVisible] = useState(false);

  const checkPermissionStatus = useCallback(async (type: PermissionType) => {
    let status: NotificationPermissionStatus = 'undetermined';
    const Notifications = getNotificationsModule();

    try {
      if (type === 'location') {
        const result = await Location.getForegroundPermissionsAsync();
        status = result.status as NotificationPermissionStatus;
      } else if (type === 'notifications') {
        if (!Notifications) {
          return { status: 'undetermined' as NotificationPermissionStatus };
        }

        const result = await Notifications.getPermissionsAsync() as {
          status: NotificationPermissionStatus;
        };
        status = result.status;
      } else if (type === 'camera') {
        status = 'undetermined';
      }
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
    }

    return { status };
  }, []);

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    try {
      let status: NotificationPermissionStatus = 'undetermined';
      const Notifications = getNotificationsModule();

      if (type === 'location') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status as NotificationPermissionStatus;
      } else if (type === 'notifications') {
        if (!Notifications) {
          return false;
        }

        const result = await Notifications.requestPermissionsAsync() as {
          status: NotificationPermissionStatus;
        };
        status = result.status;
      }

      if (status === 'granted') {
        return true;
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
