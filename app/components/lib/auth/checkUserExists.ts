export async function checkUserExists(username: string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/user-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
  
      const data = await res.json();
      console.log('✅ checkUserExists response:', data);
      return data.exists;
    } catch (error) {
      console.error('❌ Failed to check user existence:', error);
      return false;
    }
  }
  