// Request permission
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

// Create notification
function showNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: 'This is the notification body',
            icon: '/icon.png',
            badge: '/badge.png',
            tag: 'unique-tag',
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}
// usage
export const notify = async () => {
    
  // Request permission
  const granted = await Notification.requestPermission();
  
  if (granted === 'granted') {
    console.log("notttt");
    // Show notification
    new Notification('Hello!', {
      body: 'Thanks for enabling notifications!'
    });
  } else {
    console.warn('Notification permission denied.');
  }
};


