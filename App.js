import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3940256099942544~3347511713';

const adUnitIds = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3940256099942544~3347511713';

const adUnitIdS = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-3940256099942544~3347511713';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const rewarded = RewardedAd.createForAdRequest(adUnitIdS, {
  requestNonPersonalizedAdsOnly: true,
});

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);

  useEffect(() => {
    const eventListener = interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === AdEventType.OPENED) {
        setRewardedAdLoaded(false);
      }
      if (type === AdEventType.CLOSED) {
        console.log('ad closed');
        setLoaded(false);
        //reload ad
        interstitial.load();
      }
    });
    const eventListeners = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        setRewardedAdLoaded(true);
      }

      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward of ', reward);
      }
      if (type === AdEventType.OPENED) {
        setRewardedAdLoaded(false);
      }
      if (type === AdEventType.CLOSED) {
        setRewardedAdLoaded(false);
        rewarded.load();
      }
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Start loading the rewarded ad straight away
    if (rewarded.loaded) {
      setRewardedAdLoaded(true);
    } else {
      rewarded.load();
    }

    // Unsubscribe from events on unmount
    return () => {
      eventListener();
      eventListeners();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{alignSelf: 'center'}}>
        <Button
          title="Show Interstitial"
          onPress={() => {
            interstitial.show();
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 200,
          alignSelf: 'center',
        }}>
        <Button
          title="Show Rewarded Ad"
          onPress={() => {
            rewarded.show();
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
        }}>
        <BannerAd
          unitId={adUnitIds}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
};
export default App;
