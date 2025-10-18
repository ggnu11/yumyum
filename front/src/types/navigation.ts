import {NavigatorScreenParams} from '@react-navigation/native';
import {LatLng} from 'react-native-maps';

export type MapStackParamList = {
  MapHome: undefined;
  AddLocation: {location: LatLng};
  SearchLocation: undefined;
};

export type AuthStackParamList = {
  AuthHome: undefined;
  TermsAgreement: undefined;
  TermsDetail: {
    type: string;
    title: string;
  };
  KakaoLogin: undefined;
  NaverLogin: undefined;
};

export type FeedStackParamList = {
  FeedList: undefined;
  FeedDetail: {id: number};
  FeedFavorite: undefined;
  EditLocation: {id: number};
  ImageZoom: {id?: number; index: number};
};

export type SettingStackParamList = {
  SettingHome: undefined;
  EditProfile: undefined;
};

export type MainDrawerParamList = {
  Map: NavigatorScreenParams<MapStackParamList>;
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Calendar: undefined;
  Setting: undefined;
};

export type MainBottomTabParamList = {
  MapTab: NavigatorScreenParams<MapStackParamList>;
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  CalendarTab: undefined;
  MyTab: NavigatorScreenParams<SettingStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainBottomTabParamList {}
  }
}
