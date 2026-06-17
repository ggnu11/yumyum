import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {colors} from '@/constants/colors';
import useGetPost from '@/hooks/queries/useGetPost';
import useThemeStore, {Theme} from '@/store/theme';
import {getDateWithSeparator} from '@/utils/date';

interface MarkerModalProps {
  markerId: number;
  isVisible: boolean;
  hide: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

function MarkerModal({markerId, isVisible, hide}: MarkerModalProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation();
  const {data: post, isPending, isError} = useGetPost(markerId);
  const [modalVisible, setModalVisible] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [isVisible]);

  if (isPending || isError) {
    return <></>;
  }

  const handlePressModal = () => {
    navigation.navigate('Feed', {
      screen: 'FeedDetail',
      params: {
        id: post.id,
      },
      initial: false,
    });

    hide();
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <SafeAreaView style={styles.background} onTouchEnd={hide}>
        <Animated.View style={{transform: [{translateY: slideAnim}]}}>
          <Pressable style={styles.cardContainer} onPress={handlePressModal}>
            <View style={styles.handleBar} />
            <View style={styles.cardInner}>
              <View style={styles.cardAlign}>
                {post.imageUris.length > 0 && (
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: post.imageUris[0]?.uri,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                )}
                {post.imageUris.length === 0 && (
                  <View
                    style={[styles.imageContainer, styles.emptyImageContainer]}>
                    <Text style={styles.emptyText}>No Image</Text>
                  </View>
                )}
                <View style={styles.infoContainer}>
                  <View style={styles.addressContainer}>
                    <Ionicons
                      name="location-outline"
                      size={10}
                      color={colors[theme].TEAL}
                    />
                    <Text
                      style={styles.addressText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {post.address}
                    </Text>
                  </View>
                  <Text
                    style={styles.titleText}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {post.title}
                  </Text>
                  <Text style={styles.dateText}>
                    {getDateWithSeparator(post.date, '.')}
                  </Text>
                </View>
              </View>

              <View style={styles.nextButton}>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color={colors[theme].BLACK}
                />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    cardContainer: {
      backgroundColor: colors[theme].WHITE,
      marginHorizontal: 10,
      marginBottom: 10,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors[theme].GRAY_300,
      marginTop: 10,
    },
    cardInner: {
      padding: 20,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    imageContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 35,
    },
    emptyImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors[theme].BORDER,
      backgroundColor: colors[theme].BG_LIGHT,
    },
    emptyText: {
      fontSize: 12,
      color: colors[theme].TEXT_PLACEHOLDER,
    },
    infoContainer: {
      marginLeft: 15,
      gap: 5,
    },
    addressText: {
      color: colors[theme].TEXT_SECONDARY,
      fontSize: 10,
    },
    cardAlign: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    titleText: {
      color: colors[theme].BLACK,
      fontSize: 15,
      fontWeight: 'bold',
    },
    dateText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors[theme].TEAL,
    },
    nextButton: {
      width: 40,
      height: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });

export default MarkerModal;
