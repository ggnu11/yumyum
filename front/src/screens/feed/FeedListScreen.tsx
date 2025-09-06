import React, {Suspense} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import Indicator from '@/components/common/Indicator';
import RetryErrorBoundary from '@/components/common/RetryErrorBoundary';
import FeedList from '@/components/feed/FeedList';

function FeedListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <RetryErrorBoundary>
        <Suspense fallback={<Indicator size={'large'} />}>
          <FeedList />
        </Suspense>
      </RetryErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FeedListScreen;
