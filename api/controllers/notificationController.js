/**
 * Notification Controller
 * Handles user notifications
 */

const Notification = require('../models/Notification');

/**
 * Get user notifications
 * GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, skip = 0, unreadOnly = false } = req.query;

    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông báo',
      error: error.message
    });
  }
};

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy số thông báo chưa đọc',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      data: notification,
      message: 'Đã đánh dấu đã đọc'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đánh dấu thông báo',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/mark-all-read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await Notification.markAllAsRead(userId);

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      },
      message: 'Đã đánh dấu tất cả thông báo là đã đọc'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể đánh dấu thông báo',
      error: error.message
    });
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa thông báo'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
};

/**
 * Delete all read notifications
 * DELETE /api/notifications/delete-read
 */
exports.deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await Notification.deleteMany({
      userId,
      isRead: true
    });

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      },
      message: 'Đã xóa thông báo đã đọc'
    });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể xóa thông báo',
      error: error.message
    });
  }
};

/**
 * Create test notification (development only)
 * POST /api/notifications/test
 */
exports.createTestNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { type = 'system', title, message } = req.body;

    const notification = await Notification.create({
      userId,
      type,
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      icon: '🔔',
      color: '#667eea',
      priority: 'medium'
    });

    res.json({
      success: true,
      data: notification,
      message: 'Đã tạo thông báo test'
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tạo thông báo test',
      error: error.message
    });
  }
};

module.exports = exports;
