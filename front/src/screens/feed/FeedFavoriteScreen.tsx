import React, {Suspense} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import BannerAdView from '@/components/common/BannerAdView';
import Indicator from '@/components/common/Indicator';
import FeedFavoriteList from '@/components/feed/FeedFavoriteList';

function FeedFavoriteScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<Indicator size={'large'} />}>
        <FeedFavoriteList />
      </Suspense>
      <BannerAdView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FeedFavoriteScreen;
