import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
const useNativeDriver = Platform.OS !== 'web';
export default function BottomTabBarCustom({state, navigation, descriptors}) {
  const [dimensions, setDimensions] = useState(() => {
    const {height = 0, width = 0} = Dimensions.get('window');
    return {height, width};
  });
  const [layout, setLayout] = useState({
    height: 0,
    width: dimensions.width,
  });
  const visible = new Animated.Value(0);
  const [keyboardShown, setKeyboardShown] = useState(true);

  useEffect(() => {
    if (keyboardShown) {
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver,
      }).start();
    }
  }, [keyboardShown, visible]);

  useEffect(() => {
    const handleOrientationChange = ({window}: {window: ScaledSize}) => {
      setDimensions(window);
    };
    const handleKeyboardShow = () => setKeyboardShown(true);
    const handleKeyboardHide = () =>
      Animated.timing(visible, {
        toValue: 1,
        duration: 250,
        useNativeDriver,
      }).start(({finished}) => {
        if (finished) {
          setKeyboardShown(false);
        }
      });

    Dimensions.addEventListener('change', handleOrientationChange);
    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
  }, [visible]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;
    setLayout((layout) => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {height, width};
      }
    });
  };

  useEffect(() => {
    // const Timer1 = setTimeout(() => setKeyboardShown(true), 70)
    const Timer = setTimeout(() => setKeyboardShown(false), 100);
    return () => {
      // clearTimeout(Timer1)
      clearTimeout(Timer);
    };
  }, []);
  useEffect(() => {}, [keyboardShown]);

  const styleKeyBoard = keyboardShown ? {position: 'absolute'} : null;

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          transform: [
            {
              translateY: visible.interpolate({
                inputRange: [0, 1],
                outputRange: [layout.height, 0],
              }),
            },
          ],
        },
        styleKeyBoard,
      ]}
      pointerEvents={keyboardShown ? 'none' : 'auto'}>
      <View style={styles.content} onLayout={handleLayout}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
              {label === 'Information' && (
                <View style={{paddingTop: 5}}>
                  <Icon name="info" size={30} color="red" marginTop={5} />
                </View>
              )}
              {label === 'Image' && (
                <View style={{paddingTop: 5}}>
                  <Icon name="image" size={30} color="red" marginTop={5} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    height: 50,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    // elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});
