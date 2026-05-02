export type CouponKind = 'percent';

export type Coupon = {
  code: string;
  kind: CouponKind;
  percent: number;
  description: string;
  is_public: boolean;
};

export const COUPONS: Coupon[] = [
  {
    code: 'WAX15',
    kind: 'percent',
    percent: 15,
    description: '15% off — first-tin welcome',
    is_public: true,
  },
  {
    code: 'TESTORDER100',
    kind: 'percent',
    percent: 100,
    description: '100% off — internal test',
    is_public: false,
  },
];

// Razorpay minimum charge: 100 paise (₹1).
export const RAZORPAY_MIN_PAISE = 100;

export function findCoupon(rawCode: string | undefined | null): Coupon | undefined {
  if (!rawCode) return undefined;
  const code = rawCode.trim().toUpperCase();
  return COUPONS.find((c) => c.code === code);
}

export type CouponApplied = {
  code: string;
  description: string;
  percent: number;
  discount_paise: number;
  subtotal_paise: number;
  payable_paise: number;
  bumped_to_min: boolean;
};

export function applyCoupon(subtotal_paise: number, code: string | undefined | null): CouponApplied | null {
  const coupon = findCoupon(code);
  if (!coupon) return null;
  const raw_discount = Math.floor((subtotal_paise * coupon.percent) / 100);
  let payable = subtotal_paise - raw_discount;
  let bumped = false;
  if (payable < RAZORPAY_MIN_PAISE) {
    payable = RAZORPAY_MIN_PAISE;
    bumped = true;
  }
  return {
    code: coupon.code,
    description: coupon.description,
    percent: coupon.percent,
    discount_paise: subtotal_paise - payable,
    subtotal_paise,
    payable_paise: payable,
    bumped_to_min: bumped,
  };
}
