import { View, TextInput, StyleSheet, Animated, Dimensions, Text, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';

export default function MainScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const pattern1Position = useRef(new Animated.Value(0)).current;
  const pattern2Position = useRef(new Animated.Value(0)).current;
  const pattern3Position = useRef(new Animated.Value(0)).current;

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

  const titleColorInterpolation = scrollY.interpolate({
    inputRange: [0, height * 0.2, height * 0.3],
    outputRange: ['rgb(0, 0, 0)', 'rgb(0, 0, 0)', 'rgb(46, 204, 113)'],
    extrapolate: 'clamp'
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, height * 0.2, height * 0.3],
    outputRange: [1, 1, 0.5],
    extrapolate: 'clamp'
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, height * 0.2, height * 0.3],
    outputRange: [0, 0, 0],
    extrapolate: 'clamp'
  });

  const introTextOpacity = scrollY.interpolate({
    inputRange: [height * 0.1, height * 0.2],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const introTextTranslateY = scrollY.interpolate({
    inputRange: [height * 0.1, height * 0.2],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [height * 0.15, height * 0.25],
    outputRange: [100, 0],
    extrapolate: 'clamp'
  });

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
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.contentContainer}>
            <View style={{ height: height * 0.3 }} />
            
            <Animated.View 
              style={[
                styles.introSection,
                {
                  opacity: introTextOpacity,
                  transform: [{ translateY: introTextTranslateY }],
                  marginTop: height * 0.2
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
              <TextInput
                style={styles.searchBar}
                placeholder="Wpisz adres dostawy..."
                placeholderTextColor="#666"
              />
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
                { scale: titleScale }
              ],
              position: 'absolute',
              top: 0,
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
          <Text style={styles.titleText}>k</Text>
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
  searchBar: {
    height: 60,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#333',
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