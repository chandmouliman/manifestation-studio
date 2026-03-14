const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
router.post('/create-order', async (req, res) => {
  const { amount, planType } = req.body; // amount in INR
  
  if (!amount || !planType) {
    return res.status(400).json({ error: 'Amount and planType are required' });
  }

  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      planType: planType
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment Signature
router.post('/verify', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    userId,
    planType 
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      const subscriptionUntil = new Date();
      if (planType === 'monthly') {
        subscriptionUntil.setMonth(subscriptionUntil.getMonth() + 1);
      } else {
        subscriptionUntil.setFullYear(subscriptionUntil.getFullYear() + 1);
      }

      db.prepare('UPDATE users SET plan = ?, subscription_until = ? WHERE id = ?').run(
        'premium',
        subscriptionUntil.toISOString(),
        userId
      );

      res.json({ success: true, message: 'Payment verified and plan updated' });
    } catch (error) {
      console.error('Plan Update Error:', error);
      res.status(500).json({ success: false, message: 'Payment verified but failed to update plan' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});

module.exports = router;
