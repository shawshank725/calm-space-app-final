/**
 * Backend notification helper to send push notifications
 * Call this from message insertion to notify receivers even when app is closed
 */

import { logger } from './logger';
import { sendPushNotificationToUsers } from './notificationService';

interface PushNotificationData {
  receiverId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Send push notification to a user (works even when app is closed)
 */
export async function sendPushNotificationToUser({
  receiverId,
  title,
  body,
  data = {},
}: PushNotificationData): Promise<void> {
  try {
    await sendPushNotificationToUsers([receiverId], title, body, data);
  } catch (error) {
    logger.error('Background notification failed', error);
  }
}

/**
 * Send push notification when a message is sent
 */
export async function notifyNewMessage(
  receiverId: string,
  senderName: string,
  messageText: string,
  senderId: string
) {
  return sendPushNotificationToUser({
    receiverId,
    title: senderName || 'New Message',
    body: messageText.substring(0, 100),
    data: {
      type: 'message',
      senderId: senderId,
      timestamp: new Date().toISOString(),
    },
  });
}
