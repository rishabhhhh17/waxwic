import Razorpay from 'razorpay';

let _instance: Razorpay | null = null;

export function razorpay(): Razorpay {
  if (_instance) return _instance;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set');
  }
  _instance = new Razorpay({ key_id, key_secret });
  return _instance;
}
