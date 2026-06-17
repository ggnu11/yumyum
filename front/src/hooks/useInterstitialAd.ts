import {useCallback, useEffect, useRef} from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {adUnitIds} from '@/constants/ads';

function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const isLoadedRef = useRef(false);

  const loadAd = useCallback(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitIds.interstitial);

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      isLoadedRef.current = true;
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoadedRef.current = false;
      loadAd();
    });

    ad.load();
    adRef.current = ad;

    return () => {
      unsubLoaded();
      unsubClosed();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  const showAd = useCallback(() => {
    if (isLoadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, []);

  return {showAd};
}

export default useInterstitialAd;
