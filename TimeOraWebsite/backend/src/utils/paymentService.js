import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

let stripe = null;
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key';

if (isStripeConfigured) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

class PaymentService {
  /**
   * Process a payment request
   * @param {Object} data 
   * @param {number} data.amount - Amount in target currency (e.g. PKRs or USD)
   * @param {string} data.currency - Currency code (PKR, USD)
   * @param {string} data.method - Payment method: 'stripe' | 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'postex'
   * @param {string} data.orderId - Internal database order ID
   * @param {Object} data.billingDetails - Customer billing & shipping info
   */
  static async processPayment({ amount, currency = 'PKR', method, orderId, billingDetails }) {
    console.log(`Processing payment for Order ${orderId} using method: ${method}`);
    
    switch (method.toLowerCase()) {
      case 'stripe':
        return await this.handleStripe(amount, currency, orderId);
      
      case 'cod':
        return {
          success: true,
          status: 'pending',
          paymentId: `COD-${orderId}-${Date.now()}`,
          message: 'Cash on Delivery selected. Order will be settled upon delivery.'
        };
      
      case 'jazzcash':
        return await this.handleJazzCashMock(amount, orderId, billingDetails);

      case 'easypaisa':
        return await this.handleEasyPaisaMock(amount, orderId, billingDetails);

      case 'bank_transfer':
        return {
          success: true,
          status: 'pending_verification',
          paymentId: `BANK-${orderId}-${Date.now()}`,
          message: 'Bank transfer instructions sent. Please upload receipt once transferred.'
        };

      case 'postex':
        return {
          success: true,
          status: 'pending',
          paymentId: `POSTEX-${orderId}-${Date.now()}`,
          message: 'Order created via PostEx Delivery. Settlement pending.'
        };

      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }

  // Handle Stripe payment intent
  static async handleStripe(amount, currency, orderId) {
    if (!isStripeConfigured) {
      console.warn('Stripe credentials not configured. Generating mock Stripe intent.');
      return {
        success: true,
        status: 'succeeded',
        paymentId: `MOCK-STRIPE-PI-${Date.now()}`,
        clientSecret: 'mock_client_secret_xyz123',
        message: 'Mock Stripe Payment Intent generated.'
      };
    }

    try {
      // Amount in smallest currency unit (e.g., cents for USD)
      const multiplier = ['usd', 'eur', 'gbp'].includes(currency.toLowerCase()) ? 100 : 1;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * multiplier),
        currency: currency.toLowerCase(),
        metadata: { orderId },
      });

      return {
        success: true,
        status: 'requires_payment_method',
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        message: 'Stripe Payment Intent created.'
      };
    } catch (error) {
      console.error('Stripe Integration Error:', error.message);
      return {
        success: false,
        status: 'failed',
        message: `Stripe processing failed: ${error.message}`
      };
    }
  }

  // JazzCash Mock implementation
  static async handleJazzCashMock(amount, orderId, billingDetails) {
    console.log(`JazzCash Sandbox redirect/request triggered for PKR ${amount}`);
    // A production setup would initiate a secure handshake with the JazzCash API
    return {
      success: true,
      status: 'pending_verification',
      paymentId: `JC-${orderId}-${Date.now()}`,
      message: 'JazzCash payment processing initiated. Redirect user or prompt for mobile wallet PIN.'
    };
  }

  // Easypaisa Mock implementation
  static async handleEasyPaisaMock(amount, orderId, billingDetails) {
    console.log(`Easypaisa Sandbox API request triggered for PKR ${amount}`);
    // A production setup would post to Easypaisa OTC or Wallet endpoint
    return {
      success: true,
      status: 'pending_verification',
      paymentId: `EP-${orderId}-${Date.now()}`,
      message: 'Easypaisa transaction token generated. Direct integration prompt sent.'
    };
  }
}

export default PaymentService;
