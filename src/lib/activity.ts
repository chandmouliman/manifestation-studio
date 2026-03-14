const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const logUserActivity = async (userId: string, action: string, details?: string) => {
  if (!userId) return;
  
  try {
    const response = await fetch(`${API_URL}/api/activity/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action,
        details,
      }),
    });

    if (!response.ok) {
      console.error('Failed to log activity:', await response.text());
    }
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};
