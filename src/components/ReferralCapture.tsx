import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureReferral } from '../utils/referral';

// Payment return pages use `ref` for the gateway's transaction reference.
const EXCLUDED_PREFIXES = ['/checkout', '/purchase/verify', '/portal-hq'];

const ReferralCapture = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
    captureReferral(search);
  }, [pathname, search]);

  return null;
};

export default ReferralCapture;
