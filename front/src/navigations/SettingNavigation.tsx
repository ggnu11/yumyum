import {colors} from '@/constants/colors';
import EditProfileScreen from '@/screens/setting/EditProfileScreen';
import SettingHomeScreen from '@/screens/setting/SettingHomeScreen';
import useThemeStore from '@/store/theme';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export function SettingStack() {
  const {theme} = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: colors[theme][100],
        headerStyle: {
          backgroundColor: colors[theme][0],
          shadowColor: colors[theme].GRAY_500,
        },
        headerTitleStyle: {
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="SettingHome"
        component={SettingHomeScreen}
        options={{
          title: '마이',
          cardStyle: {
            backgroundColor: colors[theme].GRAY_100,
          },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: '프로필 수정',
          cardStyle: {
            backgroundColor: colors[theme][0],
          },
        }}
      />
    </Stack.Navigator>
  );
}
