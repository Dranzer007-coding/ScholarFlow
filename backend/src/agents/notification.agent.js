const prisma = require('../config/database');

/**
 * Trigger notifications (email & dashboard alerts) for status updates.
 * 
 * @param {string} userId Recipient User ID
 * @param {string} applicationId Application ID related to the notification
 * @param {string} title Notification Title
 * @param {string} message Detailed text body
 */
const sendNotification = async (userId, applicationId, title, message) => {
  try {
    // 1. Create In-App Notification record
    const notification = await prisma.notification.create({
      data: {
        userId,
        applicationId,
        title,
        message,
        type: 'IN_APP'
      }
    });

    // 2. Mock Email Send
    console.log(`[EMAIL DISPATCH] To: user@scholarflow.gov.in | Subject: ${title} | Body: ${message}`);
    
    // Create Audit Log of Notification Dispatch
    await prisma.auditLog.create({
      data: {
        applicationId,
        userId,
        actorType: 'SYSTEM',
        action: 'NOTIFICATION_DISPATCHED',
        details: `Dispatched notification: "${title}". Notification ID: ${notification.id}`
      }
    });

    return notification;
  } catch (error) {
    console.error('Failed to dispatch notification:', error);
  }
};

module.exports = {
  sendNotification
};
