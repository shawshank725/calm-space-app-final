import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type * as NotificationsTypes from 'expo-notifications';
import { logger } from './logger';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';

type NotificationsModule = typeof import('expo-notifications');

function getNotificationsModule(): NotificationsModule | null {
  if (isExpoGo) {
    return null;
  }

  return require('expo-notifications') as NotificationsModule;
}

// Configure notification behavior only if not in Expo Go
if (!isExpoGo) {
  getNotificationsModule()?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export interface PushNotificationToken {
  user_id: string;
  push_token: string;
  platform: string;
  created_at?: string;
}

/**
 * Register for push notifications and save token to database
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  let token: string | null = null;
  const Notifications = getNotificationsModule();

  try {
    // Skip push notifications in Expo Go since they're not supported in SDK 53+
    if (!Notifications) {
      logger.info('Push notifications are not available in Expo Go. Use a development build for full functionality.');
      return null;
    }

    // Check permissions but don't request them here
    const permissionStatus = await Notifications.getPermissionsAsync() as { granted: boolean };

    if (!permissionStatus.granted) {
      logger.info('Push notification permission not granted. Skipping token registration.');
      return null;
    }

    // Get push token from Expo config
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      logger.error('No Expo Project ID found in configuration. Push notifications will not work.');
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    token = pushToken.data;

    logger.info('Push token obtained successfully');

    // Save token to Supabase
    const { supabase } = require('./supabase');
    const { error: dbError } = await supabase
      .from('push_tokens')
      .upsert({
        user_id: userId,
        push_token: token,
        platform: Platform.OS,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      logger.error('Failed to save push token to database', dbError);
    } else {
      logger.info('Push token persisted to database');
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFB347',
      });
    }

  } catch (error) {
    logger.error('Error registering for push notifications', error);
  }

  return token;
}

/**
 * Send a local notification (appears immediately)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: any
) {
  // Skip local notifications in Expo Go to avoid warnings
  if (isExpoGo) {
    logger.debug(`Local notification (Expo Go): ${title} - ${body}`);
    return;
  }

  const Notifications = getNotificationsModule();

  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

/**
 * Send push notification to specific users via secure Edge Function
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  title: string,
  body: string,
  data?: any
) {
  try {
    const { supabase } = require('./supabase');

    // Secure approach: Call Edge Function instead of client-side fetch
    const { data: resData, error: funcError } = await supabase.functions.invoke('send-push', {
      body: {
        userIds,
        title,
        body,
        data: data || {},
      }
    });

    if (funcError) {
      logger.error('Edge Function push failed', funcError);
      // Fallback or handle error
    } else {
      logger.info('Push notification request sent through Edge Function');
    }

  } catch (error) {
    logger.error('Error sending push notification via function', error);
  }
}

/**
 * Send notification to all users of a specific type
 */
export async function sendNotificationToUserType(
  userType: 'STUDENT' | 'EXPERT' | 'PEER' | 'ADMIN' | 'ALL',
  title: string,
  body: string,
  data?: any
) {
  try {
    const { supabase } = require('./supabase');

    let query = supabase.from('profiles').select('id');
    if (userType !== 'ALL') {
      query = query.eq('type', userType);
    }

    const { data: users, error: userError } = await query;
    if (userError || !users) return;

    const userIds = users.map((u: any) => u.id);
    await sendPushNotificationToUsers(userIds, title, body, data);
  } catch (error) {
    logger.error('Error sending notification to user type', error);
  }
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: NotificationsTypes.Notification) => void,
  onNotificationResponse?: (response: NotificationsTypes.NotificationResponse) => void
) {
  const Notifications = getNotificationsModule();

  if (!Notifications) {
    return {
      receivedSubscription: { remove: () => {} } as NotificationsTypes.Subscription,
      responseSubscription: { remove: () => {} } as NotificationsTypes.Subscription,
    };
  }

  // Notification received while app is foregrounded
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      logger.debug('Notification received', notification);
      onNotificationReceived?.(notification);
    }
  );

  // User tapped on notification
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      logger.debug('Notification tapped', response);
      onNotificationResponse?.(response);
    }
  );

  return {
    receivedSubscription,
    responseSubscription,
  };
}

/**
 * Remove notification listeners
 */
export function removeNotificationListeners(subscriptions: {
  receivedSubscription: NotificationsTypes.Subscription;
  responseSubscription: NotificationsTypes.Subscription;
}) {
  subscriptions.receivedSubscription.remove();
  subscriptions.responseSubscription.remove();
}
