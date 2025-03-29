import { View, TextInput, StyleSheet, Animated, Dimensions, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useCallback } from 'react';
import RestaurantList from '../components/RestaurantList';

export default function MainScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const pattern1Position = useRef(new Animated.Value(0)).current;
  const pattern2Position = useRef(new Animated.Value(0)).current;
  const pattern3Position = useRef(new Animated.Value(0)).current;
  
  // Define snap points (as percentages of screen height)
  const snapPoints = [0, 0.2, 0.3, 0.38, 0.6];
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Add state for view control
  const [showRestaurantList, setShowRestaurantList] = useState(false);

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
    ]).start();
  }, []);

  // Title starts in center (at height * 0.3) and moves to top when scrolling past threshold
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, height * 0.2],
    outputRange: [height * 0.3, 0], // Start in middle, end at top
    extrapolate: 'clamp'
  });

  // Title color changes as it approaches the top
  const titleColorInterpolation = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.2],
    outputRange: ['rgb(255, 255, 255)', 'rgb(46, 204, 113)'],
    extrapolate: 'clamp'
  });

  // Title scales down as it approaches the top
  const titleScale = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.2],
    outputRange: [1, 0.5],
    extrapolate: 'clamp'
  });

  // More dramatic intro text animation
  const introTextOpacity = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const introTextTranslateY = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [100, 0], // More travel from bottom
    extrapolate: 'clamp'
  });

  // More dramatic search bar animation
  const searchBarOpacity = scrollY.interpolate({
    inputRange: [height * 0.3, height * 0.38],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [height * 0.3, height * 0.38],
    outputRange: [100, 0], // More travel from bottom
    extrapolate: 'clamp'
  });

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        
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

  // Handle when scrolling ends
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolling(false);
    
    // Find closest snap point
    const closestIndex = findClosestSnapPoint(offsetY);
    
    // Snap to closest point
    setIsAnimating(true);
    scrollToPosition(snapPoints[closestIndex] * height);
  };
  
  // Find the closest snap point index based on current scroll position
  const findClosestSnapPoint = useCallback((offsetY: number) => {
    let closestIndex = 0;
    let minDistance = Math.abs(offsetY - snapPoints[0] * height);
    
    for (let i = 1; i < snapPoints.length; i++) {
      const distance = Math.abs(offsetY - snapPoints[i] * height);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [height]);
  
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

  // Render main content view
  if (showRestaurantList) {
    return <RestaurantList onBack={() => setShowRestaurantList(false)} />;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" hidden={true} />
      <View style={styles.background}>
        {/* Animated background patterns */}
        <Animated.View
          style={[
            styles.pattern,
            styles.pattern1,
            {
              transform: [
                {
                  translateX: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, width + 300],
                  }),
                },
                {
                  translateY: pattern1Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.pattern,
            styles.pattern2,
            {
              transform: [
                {
                  translateX: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width + 300, -300],
                  }),
                },
                {
                  translateY: pattern2Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, -200],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.pattern,
            styles.pattern3,
            {
              transform: [
                {
                  translateX: pattern3Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, width + 300],
                  }),
                },
                {
                  translateY: pattern3Position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0],
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
                  opacity: introTextOpacity,
                  transform: [{ translateY: introTextTranslateY }],
                }
              ]}
            >
              <Text style={styles.introText}>
                Discover the best way to fill you up thanks to our revolutionary Boolk meter
              </Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.searchContainer,
                { 
                  opacity: searchBarOpacity,
                  transform: [{ translateY: searchBarTranslateY }]
                }
              ]}
            >
              <View style={styles.searchInputGroup}>
                <TextInput
                  style={styles.searchBar}
                  placeholder="Wpisz adres dostawy..."
                  placeholderTextColor="#666"
                />
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>Wyszukaj</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={{ height: height * 0.2 }} />

            <View style={styles.gallerySection}>
              <View style={styles.galleryItem}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Smart Ordering</Text>
                </View>
                <Text style={styles.galleryTitle}>Intelligent Order System</Text>
                <Text style={styles.galleryDescription}>
                  Our AI-powered system learns your preferences and suggests meals you'll love.
                </Text>
              </View>

              <View style={styles.galleryItem}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Real-time Tracking</Text>
                </View>
                <Text style={styles.galleryTitle}>Live Order Tracking</Text>
                <Text style={styles.galleryDescription}>
                  Track your order in real-time with our advanced GPS system.
                </Text>
              </View>

              <View style={styles.galleryItem}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>Boolk Meter</Text>
                </View>
                <Text style={styles.galleryTitle}>Revolutionary Boolk Meter</Text>
                <Text style={styles.galleryDescription}>
                  Our unique satisfaction measurement system ensures you get exactly what you need.
                </Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Fixed header outside ScrollView */}
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
          <Animated.Text style={[
            styles.titleText,
            { color: titleColorInterpolation }
          ]}>Bool</Animated.Text>
          <Text style={[
            styles.titleText, 
            { color: 'rgb(255, 255, 255)' }
          ]}>k</Text>
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
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
  },
  pattern1: {
    backgroundColor: '#3498db',
    top: -150,
    left: -150,
  },
  pattern2: {
    backgroundColor: '#2ecc71',
    top: height / 2 - 150,
    right: -150,
  },
  pattern3: {
    backgroundColor: '#e74c3c',
    bottom: -150,
    left: -150,
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
  titleText: {
    fontSize: 180,
    fontWeight: '900',
  },
  introSection: {
    paddingHorizontal: 40,
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  introText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    lineHeight: 42,
  },
  searchContainer: {
    width: '80%',
    maxWidth: 500,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 40,
    marginBottom: 60,
  },
  searchInputGroup: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  searchBar: {
    height: 60,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#2ecc71',
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gallerySection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  galleryItem: {
    marginBottom: 80,
    opacity: 0.95,
  },
  imagePlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  galleryDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 24,
    fontWeight: '500',
  },
}); 