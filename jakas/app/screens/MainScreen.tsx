import { View, TextInput, StyleSheet, Animated, Dimensions, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, Image, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import RestaurantList from '../components/RestaurantList';

// Define icon components since we don't have Lucide-React
const IconSparkles = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>✨</Text>
  </View>
);

const IconClock = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>⏱️</Text>
  </View>
);

const IconTarget = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>🎯</Text>
  </View>
);

const IconArrowRight = () => (
  <Text style={styles.arrowIcon}>→</Text>
);

export default function MainScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const pattern1Position = useRef(new Animated.Value(0)).current;
  const pattern2Position = useRef(new Animated.Value(0)).current;
  const pattern3Position = useRef(new Animated.Value(0)).current;
  const pattern4Position = useRef(new Animated.Value(0)).current;
  const pattern5Position = useRef(new Animated.Value(0)).current;
  const pattern6Position = useRef(new Animated.Value(0)).current;
  const pattern7Position = useRef(new Animated.Value(0)).current;
  const pattern8Position = useRef(new Animated.Value(0)).current;
  const pattern9Position = useRef(new Animated.Value(0)).current;
  const pattern10Position = useRef(new Animated.Value(0)).current;
  const pattern11Position = useRef(new Animated.Value(0)).current;
  const pattern12Position = useRef(new Animated.Value(0)).current;
  
  // Define snap points to align with animation endpoints
  const snapPoints = [
    0,                  // Initial position
    height * 0.15,      // Title transformation complete
    height * 0.22,      // Intro text fully visible
    height * 0.3,       // Search bar fully visible
    height * 0.6,       // First gallery item visible
    height * 1.0,       // Second gallery item visible
    height * 1.4        // Third gallery item visible
  ];
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Add state for view control
  const [showRestaurantList, setShowRestaurantList] = useState(false);

  // Add animation states to track
  const titleAnimationComplete = useRef(false);
  const introAnimationComplete = useRef(false);
  const searchBarAnimationComplete = useRef(false);

  // State to track if components have been revealed
  const [introTextRevealed, setIntroTextRevealed] = useState(false);
  const [searchBarRevealed, setSearchBarRevealed] = useState(false);

  // Add state for letter hover effects
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  
  // Create animated values for each letter
  const letterScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current
  ];

  // Background patterns animation
  React.useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern1Position, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern1Position, {
            toValue: 0,
            duration: 15000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern2Position, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern2Position, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern3Position, {
            toValue: 1,
            duration: 25000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern3Position, {
            toValue: 0,
            duration: 25000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern4Position, {
            toValue: 1,
            duration: 18000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern4Position, {
            toValue: 0,
            duration: 18000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern5Position, {
            toValue: 1,
            duration: 22000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern5Position, {
            toValue: 0,
            duration: 22000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern6Position, {
            toValue: 1,
            duration: 17000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern6Position, {
            toValue: 0,
            duration: 17000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern7Position, {
            toValue: 1,
            duration: 23000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern7Position, {
            toValue: 0,
            duration: 23000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern8Position, {
            toValue: 1,
            duration: 19000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern8Position, {
            toValue: 0,
            duration: 19000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern9Position, {
            toValue: 1,
            duration: 24000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern9Position, {
            toValue: 0,
            duration: 24000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern10Position, {
            toValue: 1,
            duration: 21000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern10Position, {
            toValue: 0,
            duration: 21000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern11Position, {
            toValue: 1,
            duration: 16000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern11Position, {
            toValue: 0,
            duration: 16000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pattern12Position, {
            toValue: 1,
            duration: 26000,
            useNativeDriver: true,
          }),
          Animated.timing(pattern12Position, {
            toValue: 0,
            duration: 26000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  // Title starts in center (at height * 0.3) and moves to top when scrolling past threshold
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, height * 0.15],
    outputRange: [height * 0.3, 0], // Start in middle, end at top
    extrapolate: 'clamp'
  });

  // Title color changes as it approaches the top
  const titleColorInterpolation = scrollY.interpolate({
    inputRange: [height * 0.10, height * 0.15],
    outputRange: ['rgb(255, 255, 255)', 'rgb(46, 204, 113)'],
    extrapolate: 'clamp'
  });

  // Title scales down as it approaches the top
  const titleScale = scrollY.interpolate({
    inputRange: [height * 0.10, height * 0.15],
    outputRange: [1, 0.5],
    extrapolate: 'clamp'
  });

  // More dramatic intro text animation - stays visible - starts earlier
  const introTextOpacity = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.22],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const introTextTranslateY = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.22],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

  // More dramatic search bar animation - stays visible - starts earlier
  const searchBarOpacity = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

  // Keep elements visible as we scroll further
  const elementsVisibility = scrollY.interpolate({
    inputRange: [height * 0.3, height * 2],
    outputRange: [1, 1], // Stay at full opacity
    extrapolate: 'clamp'
  });
  
  // Enhanced handle scroll with animation tracking and persistence
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
        // Track animation states
        if (offsetY >= height * 0.15 && !titleAnimationComplete.current) {
          titleAnimationComplete.current = true;
        } else if (offsetY < height * 0.15 && titleAnimationComplete.current) {
          titleAnimationComplete.current = false;
        }
        
        // Mark intro text as revealed once we pass the threshold
        if (offsetY >= height * 0.22) {
          setIntroTextRevealed(true);
        }
        
        // Mark search bar as revealed once we pass the threshold
        if (offsetY >= height * 0.3) {
          setSearchBarRevealed(true);
        }
        
        // Find nearest snap point when scrolling stops
        if (!isAnimating) {
          const closestSnapPoint = findClosestSnapPoint(offsetY);
          setCurrentSnapIndex(closestSnapPoint);
        }
      }
    }
  );

  // Handle when scrolling begins
  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  // Handle when scrolling ends with improved snapping
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolling(false);
    
    // Find closest snap point with preference for completed animations
    let targetIndex = findClosestSnapPoint(offsetY);
    
    // If we're in the middle of a transition, snap to completion
    if (offsetY > height * 0.15 && offsetY < height * 0.2) {
      targetIndex = 1; // Snap to title transformation complete
    } else if (offsetY > height * 0.22 && offsetY < height * 0.3) {
      targetIndex = 2; // Snap to intro text fully visible
    } else if (offsetY > height * 0.3 && offsetY < height * 0.38) {
      targetIndex = 3; // Snap to search bar fully visible
    }
    
    // Check if we're already very close to a snap point to avoid unnecessary animations
    if (Math.abs(offsetY - snapPoints[targetIndex]) < 10) {
      return;
    }
    
    // Snap to closest point
    setIsAnimating(true);
    scrollToPosition(snapPoints[targetIndex]);
  };
  
  // Find the closest snap point index based on current scroll position
  const findClosestSnapPoint = useCallback((offsetY: number) => {
    let closestIndex = 0;
    let minDistance = Math.abs(offsetY - snapPoints[0]);
    
    for (let i = 1; i < snapPoints.length; i++) {
      const distance = Math.abs(offsetY - snapPoints[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [snapPoints]);
  
  // Scroll to specified position with animation
  const scrollToPosition = useCallback((position: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: position,
        animated: true
      });
      
      // Reset animating state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, []);

  // Handle search button press
  const handleSearch = () => {
    setShowRestaurantList(true);
  };

  // Calculate opacity values considering revealed state
  const calculatedIntroOpacity = useCallback(() => {
    if (introTextRevealed) {
      return 1; // Always visible once revealed
    }
    return introTextOpacity; // Use animation until revealed
  }, [introTextOpacity, introTextRevealed]);
  
  const calculatedSearchOpacity = useCallback(() => {
    if (searchBarRevealed) {
      return 1; // Always visible once revealed
    }
    return searchBarOpacity; // Use animation until revealed
  }, [searchBarOpacity, searchBarRevealed]);

  // Handle letter hover effect
  const handleLetterHover = (index: number, isHovering: boolean) => {
    // Only respond to hover events on web platform
    if (Platform.OS !== 'web') return;
    
    // Update hovered letter state
    setHoveredLetter(isHovering ? index : null);
    
    // Animate the hovered letter scale
    Animated.spring(letterScales[index], {
      toValue: isHovering ? 1.3 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true
    }).start();
    
    // Animate other letters to move away or back
    letterScales.forEach((scale, i) => {
      if (i !== index) {
        Animated.spring(scale, {
          toValue: isHovering ? 0.9 : 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true
        }).start();
      }
    });
  };

  // Render main content view
  if (showRestaurantList) {
    return <RestaurantList onBack={() => setShowRestaurantList(false)} />;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" hidden={true} />
      <View style={styles.background}>
        {/* Animated background patterns */}
        <Animated.Image
          source={require('../../assets/images/icons/pizza.png')}
          style={[
            styles.pattern,
            styles.pattern1,
            {
              transform: [
                {
                  translateX: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, width + 60],
                  }),
                },
                {
                  translateY: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                },
                {
                  rotate: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={require('../../assets/images/icons/burger.png')}
          style={[
            styles.pattern,
            styles.pattern2,
            {
              transform: [
                {
                  translateX: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width + 60, -60],
                  }),
                },
                {
                  translateY: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, -200],
                  }),
                },
                {
                  rotate: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={require('../../assets/images/icons/hot-dog.png')}
          style={[
            styles.pattern,
            styles.pattern3,
            {
              transform: [
                {
                  translateX: pattern3Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, width + 60],
                  }),
                },
                {
                  translateY: pattern3Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
                  }),
                },
                {
                  rotate: pattern3Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Add two more food icons */}
        <Animated.Image
          source={require('../../assets/images/icons/kebab.png')}
          style={[
            styles.pattern,
            styles.pattern4,
            {
              transform: [
                {
                  translateX: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, 0],
                  }),
                },
                {
                  translateY: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 300],
                  }),
                },
                {
                  rotate: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/fast-food.png')}
          style={[
            styles.pattern,
            styles.pattern5,
            {
              transform: [
                {
                  translateX: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width],
                  }),
                },
                {
                  translateY: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [150, -50],
                  }),
                },
                {
                  rotate: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-180deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Add three more floating food icons */}
        <Animated.Image
          source={require('../../assets/images/icons/pizza.png')}
          style={[
            styles.pattern,
            styles.pattern6,
            {
              transform: [
                {
                  translateX: pattern6Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width / 2, -width / 2],
                  }),
                },
                {
                  translateY: pattern6Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 150],
                  }),
                },
                {
                  rotate: pattern6Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '540deg'],
                  }),
                },
                {
                  scale: pattern6Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/burger.png')}
          style={[
            styles.pattern,
            styles.pattern7,
            {
              transform: [
                {
                  translateX: pattern7Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, width - 30],
                  }),
                },
                {
                  translateY: pattern7Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, -100, 0],
                  }),
                },
                {
                  rotate: pattern7Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '270deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/mcdonalds.png')}
          style={[
            styles.pattern,
            styles.pattern8,
            {
              transform: [
                {
                  translateX: pattern8Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width / 4, width * 0.75],
                  }),
                },
                {
                  translateY: pattern8Position.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [0, 100, 200, 0], // Wave-like movement
                  }),
                },
                {
                  rotate: pattern8Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Mirror patterns with different animations */}
        <Animated.Image
          source={require('../../assets/images/icons/kebab.png')}
          style={[
            styles.pattern,
            styles.pattern9,
            {
              transform: [
                {
                  translateX: pattern7Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width * 0.75, width * 0.25],
                  }),
                },
                {
                  translateY: pattern7Position.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: [0, 50, 0, -50, 0, 50], // Zigzag movement
                  }),
                },
                {
                  rotate: pattern7Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/fast-food.png')}
          style={[
            styles.pattern,
            styles.pattern10,
            {
              transform: [
                {
                  translateX: pattern6Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, 0],
                  }),
                },
                {
                  translateY: pattern6Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [height * 0.25, height * 0.1, height * 0.25], // Arc movement
                  }),
                },
                {
                  rotate: pattern6Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '180deg', '360deg'],
                  }),
                },
                {
                  scale: pattern6Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.3, 1],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/fried-chicken.png')}
          style={[
            styles.pattern,
            styles.pattern11,
            {
              transform: [
                {
                  translateX: pattern11Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width * 0.2, width * 0.8],
                  }),
                },
                {
                  translateY: pattern11Position.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [height * 0.2, height * 0.3, height * 0.1, height * 0.2], // Circular-like path
                  }),
                },
                {
                  rotate: pattern11Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '540deg'],
                  }),
                },
                {
                  scale: pattern11Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.15, 1],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/hot-dog.png')}
          style={[
            styles.pattern,
            styles.pattern12,
            {
              transform: [
                {
                  translateX: pattern12Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width * 0.9, width * 0.1],
                  }),
                },
                {
                  translateY: pattern12Position.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: [height * 0.5, height * 0.45, height * 0.4, height * 0.45, height * 0.5, height * 0.55], // Wavy diagonal path
                  }),
                },
                {
                  rotate: pattern12Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '180deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/mcdonalds.png')}
          style={[
            styles.pattern,
            styles.pattern13,
            {
              transform: [
                {
                  translateX: pattern9Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width * 0.3, width * 0.7],
                  }),
                },
                {
                  translateY: pattern9Position.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: [height * 0.7, height * 0.65, height * 0.6, height * 0.65, height * 0.7], // Small arc at bottom
                  }),
                },
                {
                  rotate: pattern9Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-45deg', '45deg'],
                  }),
                },
                {
                  scale: pattern9Position.interpolate({
                    inputRange: [0, 0.3, 0.6, 1],
                    outputRange: [1, 1.1, 1.1, 1],
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.Image
          source={require('../../assets/images/icons/fried-chicken.png')}
          style={[
            styles.pattern,
            styles.pattern14,
            {
              transform: [
                {
                  translateX: pattern10Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width],
                  }),
                },
                {
                  translateY: pattern10Position.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [height * 0.4, height * 0.3, height * 0.4], // Top arc
                  }),
                },
                {
                  rotate: pattern10Position.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'], // Full rotation with different speeds
                  }),
                },
              ],
            },
          ]}
        />
        
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBegin}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          decelerationRate="fast"
        >
          <View style={styles.contentContainer}>
            <View style={{ height: height * 0.6 }} />
            
            <Animated.View 
              style={[
                styles.introSection,
                {
                  opacity: calculatedIntroOpacity(),
                  transform: [{ 
                    translateY: introTextRevealed ? 0 : introTextTranslateY 
                  }],
                }
              ]}
            >
              <Text style={styles.introText}>
                Najlepszy sposób by zaspokoić głód dzięki rewolucyjnemu Boolk Meter™
              </Text>
            </Animated.View>

            <View style={styles.searchAndImageContainer}>
              <Animated.View 
                style={[
                  styles.searchContainerModern,
                  { 
                    opacity: calculatedSearchOpacity(),
                    transform: [{ 
                      translateY: searchBarRevealed ? 0 : searchBarTranslateY 
                    }]
                  }
                ]}
              >
                <View style={styles.searchInputGroup}>
                  <TextInput
                    style={styles.searchBarModern}
                    placeholder="Wpisz adres dostawy..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                  <TouchableOpacity 
                    style={styles.searchButtonModern}
                    onPress={handleSearch}
                  >
                    <Text style={styles.searchButtonText}>Wyszukaj</Text>
                    <IconArrowRight />
                  </TouchableOpacity>
                </View>
              </Animated.View>
              
              <Animated.View
                style={[
                  styles.imageContainer,
                  {
                    opacity: calculatedSearchOpacity(),
                    transform: [
                      { translateY: searchBarRevealed ? 0 : searchBarTranslateY }
                    ]
                  }
                ]}
              >
                <Image 
                  source={require('../../assets/images/pudzian.png')} 
                  style={styles.pudzianImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            <View style={{ height: height * 0.2 }} />

            <View style={styles.gallerySection}>
              <Animated.View 
                style={[
                  styles.featureCard,
                  {
                    opacity: scrollY.interpolate({
                      inputRange: [height * 0.6, height * 0.7],
                      outputRange: [0, 1],
                      extrapolate: 'clamp'
                    }),
                    transform: [
                      { 
                        translateY: scrollY.interpolate({
                          inputRange: [height * 0.6, height * 0.7],
                          outputRange: [50, 0],
                          extrapolate: 'clamp'
                        })
                      },
                      {
                        scale: scrollY.interpolate({
                          inputRange: [height * 0.6, height * 0.7],
                          outputRange: [0.95, 1],
                          extrapolate: 'clamp'
                        })
                      }
                    ]
                  }
                ]}
              >
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" }} 
                  style={styles.featureImageLarge}
                  resizeMode="cover"
                />
                <Text style={styles.featureTitle}>Dlaczego Boolk?</Text>
                <Text style={styles.featureDescription}>
                  Z racji coraz większych kosztów życia dla studentów w miastach Boolk dzięki technologi AI wyszukuje miejsca z najlepszym stosunkiem ilości jedzenia do ceny. Dzięki temu użytkownicy mogą spróbować nowych smaków, bez obaw o swój portfel.
                </Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.featureCard,
                  {
                    opacity: scrollY.interpolate({
                      inputRange: [height * 0.8, height * 0.9],
                      outputRange: [0, 1],
                      extrapolate: 'clamp'
                    }),
                    transform: [
                      { 
                        translateY: scrollY.interpolate({
                          inputRange: [height * 0.8, height * 0.9],
                          outputRange: [50, 0],
                          extrapolate: 'clamp'
                        })
                      },
                      {
                        scale: scrollY.interpolate({
                          inputRange: [height * 0.8, height * 0.9],
                          outputRange: [0.95, 1],
                          extrapolate: 'clamp'
                        })
                      }
                    ]
                  }
                ]}
              >
                <IconClock />
                <Text style={styles.featureTitle}>Co to Boolk Meter</Text>
                <Text style={styles.featureDescription}>
                  Boolk to zaawansowany system, który na podstawie opinii użytkowników pomaga wybrać restaurację, gdzie zjesz NAJWIĘCEJ za rozsądną cenę. Nasz algorytm sztucznej inteligencji analizuje dane i wybiera najlepszą opcję!
                </Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.featureCard,
                  {
                    opacity: scrollY.interpolate({
                      inputRange: [height * 1.0, height * 1.1],
                      outputRange: [0, 1],
                      extrapolate: 'clamp'
                    }),
                    transform: [
                      { 
                        translateY: scrollY.interpolate({
                          inputRange: [height * 1.0, height * 1.1],
                          outputRange: [50, 0],
                          extrapolate: 'clamp'
                        })
                      },
                      {
                        scale: scrollY.interpolate({
                          inputRange: [height * 1.0, height * 1.1],
                          outputRange: [0.95, 1],
                          extrapolate: 'clamp'
                        })
                      }
                    ]
                  }
                ]}
              >
                <IconTarget />
                <Text style={styles.featureTitle}>Technologie</Text>
                <Text style={styles.featureDescription}>
                  Our AI-powered system learns your preferences and suggests meals you'll love. Technology at your service.
                </Text>
              </Animated.View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Fixed header with interactive letters */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslateY }
              ],
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 2,
            }
          ]}
        >
          <View style={styles.titleLettersContainer}>
            {/* B */}
            <Animated.Text 
              style={[
                styles.titleText,
                { 
                  color: titleColorInterpolation,
                  transform: [{ scale: letterScales[0] }]
                }
              ]}
              onMouseEnter={() => handleLetterHover(0, true)}
              onMouseLeave={() => handleLetterHover(0, false)}
            >
              B
            </Animated.Text>
            
            {/* o */}
            <Animated.Text 
              style={[
                styles.titleText,
                { 
                  color: titleColorInterpolation,
                  transform: [{ scale: letterScales[1] }]
                }
              ]}
              onMouseEnter={() => handleLetterHover(1, true)}
              onMouseLeave={() => handleLetterHover(1, false)}
            >
              o
            </Animated.Text>
            
            {/* o */}
            <Animated.Text 
              style={[
                styles.titleText,
                { 
                  color: titleColorInterpolation,
                  transform: [{ scale: letterScales[2] }]
                }
              ]}
              onMouseEnter={() => handleLetterHover(2, true)}
              onMouseLeave={() => handleLetterHover(2, false)}
            >
              o
            </Animated.Text>
            
            {/* l */}
            <Animated.Text 
              style={[
                styles.titleText,
                { 
                  color: titleColorInterpolation,
                  transform: [{ scale: letterScales[3] }]
                }
              ]}
              onMouseEnter={() => handleLetterHover(3, true)}
              onMouseLeave={() => handleLetterHover(3, false)}
            >
              l
            </Animated.Text>
            
            {/* k */}
            <Animated.Text 
              style={[
                styles.titleText,
                { 
                  color: 'rgb(255, 255, 255)',
                  transform: [{ scale: letterScales[4] }]
                }
              ]}
              onMouseEnter={() => handleLetterHover(4, true)}
              onMouseLeave={() => handleLetterHover(4, false)}
            >
              k
            </Animated.Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  pattern: {
    position: 'absolute',
    width: 120,
    height: 120,
    opacity: 0.4,
  },
  pattern1: {
    top: -60,
    left: -60,
    tintColor: 'rgba(142, 209, 252, 0.8)',
  },
  pattern2: {
    top: height / 2 - 60,
    right: -60,
    tintColor: 'rgba(163, 252, 183, 0.8)',
  },
  pattern3: {
    bottom: -60,
    left: -60,
    tintColor: 'rgba(250, 177, 160, 0.8)',
  },
  pattern4: {
    bottom: height / 3,
    right: width / 4,
    tintColor: 'rgba(253, 236, 170, 0.8)',
  },
  pattern5: {
    top: height / 4,
    left: width / 3,
    tintColor: 'rgba(212, 186, 255, 0.8)',
  },
  // New pattern styles
  pattern6: {
    top: height / 6,
    right: width / 5,
    width: 80, // Smaller size
    height: 80,
    tintColor: 'rgba(142, 209, 252, 0.6)', // Light blue with different opacity
  },
  pattern7: {
    bottom: height / 5,
    left: width / 6,
    width: 90, // Different size
    height: 90,
    tintColor: 'rgba(163, 252, 183, 0.5)', // Light green with different opacity
  },
  pattern8: {
    top: height / 2.5,
    right: width / 2.5,
    width: 70, // Smaller size
    height: 70,
    tintColor: 'rgba(250, 177, 160, 0.7)', // Light orange with different opacity
  },
  // Additional patterns with same icon but different styles
  pattern9: {
    top: height / 1.8,
    left: width / 2.3,
    width: 60, // Smallest
    height: 60,
    tintColor: 'rgba(253, 236, 170, 0.5)', // Light yellow with different opacity
  },
  pattern10: {
    bottom: height / 8,
    right: width / 9,
    width: 50, // Smallest
    height: 50,
    tintColor: 'rgba(212, 186, 255, 0.6)', // Light purple with different opacity
  },
  pattern11: {
    top: height * 0.2,
    left: width * 0.3,
    width: 85,
    height: 85,
    tintColor: 'rgba(255, 184, 108, 0.6)', // Light orange
  },
  pattern12: {
    top: height * 0.5,
    right: width * 0.1,
    width: 75,
    height: 75,
    tintColor: 'rgba(255, 145, 77, 0.55)', // Darker orange
  },
  pattern13: {
    bottom: height * 0.15,
    left: width * 0.3,
    width: 65,
    height: 65,
    tintColor: 'rgba(255, 215, 79, 0.65)', // Yellow/gold for McDonald's
  },
  pattern14: {
    top: height * 0.4,
    left: 0,
    width: 70,
    height: 70,
    tintColor: 'rgba(246, 158, 123, 0.6)', // Light brownish for fried chicken
  },
  contentContainer: {
    minHeight: height * 2,
    alignItems: 'center',
    paddingTop: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    height: height * 0.15,
  },
  titleLettersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 180,
    fontWeight: '900',
  },
  introSection: {
    paddingHorizontal: 0,
    marginBottom: 40,
    alignSelf: 'flex-start',
    marginLeft: 100,
    marginRight: 100,
    width: '80%',
  },
  introText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    lineHeight: 42,
  },
  searchAndImageContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
    position: 'relative',
    paddingLeft: 100,
    paddingRight: 100,
  },
  searchContainerModern: {
    width: '80%',
    maxWidth: 500,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginLeft: 0,
    zIndex: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  imageContainer: {
    width: width * 0.3,  // Reduced from 0.6 to 0.3 (2x smaller)
    height: width * 0.3, // Maintain aspect ratio
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -width * 0.075, // Adjusted right position for smaller image
    bottom: -height * 0.1, // Adjusted bottom position for smaller image
    zIndex: 1,
  },
  searchInputGroup: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  searchBarModern: {
    height: 60,
    paddingHorizontal: 20,
    fontSize: 18,
    color: 'white',
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchButtonModern: {
    backgroundColor: '#2ecc71',
    height: 50,
    paddingHorizontal: 20,
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 16,
  },
  gallerySection: {
    width: '100%',
    paddingTop: 60,
    paddingLeft: 100,
    paddingRight: 100,
    position: 'relative',
    zIndex: 2,
  },
  featureCard: {
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 16,
  },
  featureDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  pudzianImage: {
    width: '100%',
    height: '100%',
  },
  featureImage: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  featureImageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
}); 