import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {adUnitIds} from '@/constants/ads';

function BannerAdView() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={[styles.container, !isLoaded && styles.hidden]}>
      <BannerAd
        unitId={adUnitIds.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => setIsLoaded(true)}
        onAdFailedToLoad={() => setIsLoaded(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});

export default BannerAdView;
