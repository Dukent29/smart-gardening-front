import axios from './axios';

// Get all notifications for a user
export const getNotifications = (userId) =>
  axios.get(`/notifications/${userId}`).then((res) => res.data);

// Mark a notification as read
export const markNotificationAsRead = (id) =>
  axios.patch(`/notifications/${id}/read`).then((res) => res.data);

// Create a new notification
export const createNotification = (notificationData) =>
  axios.post('/notifications', notificationData).then((res) => res.data);
