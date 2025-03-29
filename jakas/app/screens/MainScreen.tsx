import { View, TextInput, StyleSheet, Animated, Dimensions, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, Image, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import RestaurantList from '../components/RestaurantList';

export default function MainScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const pattern1Position = useRef(new Animated.Value(0)).current;
  const pattern2Position = useRef(new Animated.Value(0)).current;
  const pattern3Position = useRef(new Animated.Value(0)).current;
  
  // Define snap points to align with animation endpoints
  const snapPoints = [
    0,                  // Initial position
    height * 0.2,       // Title transformation complete
    height * 0.3,       // Intro text fully visible
    height * 0.38,      // Search bar fully visible
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

  // More dramatic intro text animation - stays visible
  const introTextOpacity = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const introTextTranslateY = scrollY.interpolate({
    inputRange: [height * 0.22, height * 0.3],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

  // More dramatic search bar animation - stays visible
  const searchBarOpacity = scrollY.interpolate({
    inputRange: [height * 0.3, height * 0.38],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [height * 0.3, height * 0.38],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

  // Keep elements visible as we scroll further
  const elementsVisibility = scrollY.interpolate({
    inputRange: [height * 0.38, height * 2],
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
        if (offsetY >= height * 0.2 && !titleAnimationComplete.current) {
          titleAnimationComplete.current = true;
        } else if (offsetY < height * 0.2 && titleAnimationComplete.current) {
          titleAnimationComplete.current = false;
        }
        
        // Mark intro text as revealed once we pass the threshold
        if (offsetY >= height * 0.3) {
          setIntroTextRevealed(true);
        }
        
        // Mark search bar as revealed once we pass the threshold
        if (offsetY >= height * 0.38) {
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
                  opacity: calculatedIntroOpacity(),
                  transform: [{ 
                    translateY: introTextRevealed ? 0 : introTextTranslateY 
                  }],
                }
              ]}
            >
              <Text style={styles.introText}>
                Discover the best way to fill you up thanks to our revolutionary Boolk meter
              </Text>
            </Animated.View>

            <View style={styles.searchAndImageContainer}>
              <Animated.View 
                style={[
                  styles.searchContainer,
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
  searchContainer: {
    width: '80%',
    maxWidth: 500,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignSelf: 'flex-start',
    zIndex: 2,
  },
  imageContainer: {
    width: 750,  // Even larger
    height: 750, // Even larger
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -100, // Move it more to the right to overlap with content
    bottom: -350, // Position it lower to overlap with gallery
    zIndex: 1, // Between search bar and gallery content
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
    paddingTop: 60,
    paddingLeft: 100,
    paddingRight: 100,
    position: 'relative',
    zIndex: 2,
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
  pudzianImage: {
    width: '100%',
    height: '100%',
  },
}); 