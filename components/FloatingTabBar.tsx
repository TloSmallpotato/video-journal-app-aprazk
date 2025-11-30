
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  isCenter?: boolean;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth - 40,
  borderRadius = 35,
  bottomMargin
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const animatedValue = useSharedValue(0);

  // Improved active tab detection with better path matching
  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      // Exact route match gets highest score
      if (pathname === tab.route) {
        score = 100;
      }
      // Check if pathname starts with tab route (for nested routes)
      else if (pathname.startsWith(tab.route as string)) {
        score = 80;
      }
      // Check if pathname contains the tab name
      else if (pathname.includes(tab.name)) {
        score = 60;
      }
      // Check for partial matches in the route
      else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    // Default to profile tab (last tab) if no match found
    return bestMatch >= 0 ? bestMatch : tabs.length - 1;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 20,
        stiffness: 120,
        mass: 1,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  // Dynamic styles based on design
  const dynamicStyles = {
    blurContainer: {
      ...styles.blurContainer,
      backgroundColor: '#C8BFDB',
      borderRadius,
    },
    background: {
      ...styles.background,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[
        styles.container,
        {
          width: containerWidth,
          marginBottom: bottomMargin ?? 20
        }
      ]}>
        <View style={[dynamicStyles.blurContainer]}>
          <View style={dynamicStyles.background} />
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = activeTabIndex === index;
              const isCenter = tab.isCenter;

              if (isCenter) {
                return (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={styles.centerTab}
                      onPress={() => handleTabPress(tab.route)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.centerTabButton}>
                        <IconSymbol
                          android_material_icon_name={tab.icon}
                          ios_icon_name={tab.icon}
                          size={32}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={styles.centerTabLabel}>{tab.label}</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tabContent}>
                      <View style={[
                        styles.iconContainer,
                        isActive && styles.iconContainerActive
                      ]}>
                        <IconSymbol
                          android_material_icon_name={tab.icon}
                          ios_icon_name={tab.icon}
                          size={24}
                          color={isActive ? '#FFFFFF' : '#2E2A8B'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.tabLabel,
                          isActive && styles.tabLabelActive,
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#FF6B35',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2E2A8B',
  },
  tabLabelActive: {
    fontWeight: '600',
    color: '#2E2A8B',
  },
  centerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E2A8B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  centerTabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2E2A8B',
  },
});
