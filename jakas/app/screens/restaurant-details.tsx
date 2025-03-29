import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Dimensions, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { restaurants } from '../data/restaurants';

const { width: screenWidth } = Dimensions.get('window');
const imageWidth = screenWidth * 0.85; // 85% of screen width
const imageHeight = screenWidth * 0.2; // 20% of screen width
const leftMargin = (screenWidth - imageWidth) / 2 * 0.8; // 6% margin on left
const rightMargin = leftMargin * 0.9; // 5.4% margin on right
const imageMargin = { left: leftMargin, right: rightMargin };

const RestaurantDetails = () => {
  const { width: windowWidth } = useWindowDimensions();
  const isSmallScreen = windowWidth < 768; // Breakpoint for tablets
  const { id } = useLocalSearchParams();
  const restaurant = restaurants.find(r => r.id === id);
  const starAnimations = useRef([...Array(10)].map(() => new Animated.Value(0))).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const descriptionAnimation = useRef(new Animated.Value(0)).current;
  const reviewsAnimation = useRef(new Animated.Value(0)).current;
  const imageAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate image first
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate sections first
    Animated.sequence([
      Animated.delay(1000), // Wait for image to finish
      Animated.parallel([
        Animated.timing(headerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(reviewsAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate stars last, after sections are fully visible
    Animated.sequence([
      Animated.delay(2000), // Wait for image (1s) + delay (1s) + sections (1s) - reduced by 1s
      Animated.stagger(100, // Faster delay between stars
        starAnimations.map(animation =>
          Animated.timing(animation, {
            toValue: 1,
            duration: 500, // Faster star animation
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!isSmallScreen && (
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: restaurant.imageUrl }}
            style={[
              styles.restaurantImage,
              {
                opacity: imageAnimation,
                transform: [
                  {
                    scale: imageAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
            resizeMode="cover"
          />
        </View>
      )}
      <Animated.View style={[
        styles.header,
        {
          opacity: headerAnimation,
          transform: [{
            translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          backgroundColor: isSmallScreen ? 'transparent' : '#f8f8f8',
          paddingTop: isSmallScreen ? 0 : 20,
        },
      ]}>
        {isSmallScreen && (
          <Animated.Image
            source={{ uri: restaurant.imageUrl }}
            style={[
              styles.headerBackgroundImage,
              {
                opacity: headerAnimation,
                transform: [{
                  scale: headerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                }],
              },
            ]}
            resizeMode="cover"
          />
        )}
        <View style={[
          styles.headerContent,
          {
            backgroundColor: isSmallScreen ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
            padding: isSmallScreen ? 20 : 0,
            borderRadius: isSmallScreen ? 12 : 0,
          },
        ]}>
          <Text style={[
            styles.restaurantName,
            { color: isSmallScreen ? '#fff' : '#000' }
          ]}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(10)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.star,
                  {
                    opacity: starAnimations[index],
                    transform: [
                      {
                        scale: starAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialIcons
                  name={index < restaurant.rating ? 'star' : 'star-border'}
                  size={24}
                  color="#FFD700"
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[
        styles.descriptionContainer,
        {
          opacity: descriptionAnimation,
          transform: [{
            translateY: descriptionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}>
        <Text style={styles.description}>{restaurant.description}</Text>
      </Animated.View>

      <Animated.View style={[
        styles.reviewsContainer,
        {
          opacity: reviewsAnimation,
          transform: [{
            translateY: reviewsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        },
      ]}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        {restaurant.reviews.map((review) => (
          <View key={review.date} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewDate}>{review.date}</Text>
              <View style={styles.reviewRating}>
                {[...Array(10)].map((_, index) => (
                  <MaterialIcons
                    key={index}
                    name={index < review.rating ? 'star' : 'star-border'}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: imageMargin.right,
    paddingLeft: imageMargin.left,
    marginBottom: 30,
  },
  restaurantImage: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 12,
  },
  header: {
    width: imageWidth,
    marginHorizontal: imageMargin.right,
    marginLeft: imageMargin.left,
    borderRadius: 12,
    marginBottom: 30,
    overflow: 'hidden',
  },
  headerBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  headerContent: {
    zIndex: 2,
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
  descriptionContainer: {
    padding: 20,
    width: imageWidth,
    marginHorizontal: imageMargin.right,
    marginLeft: imageMargin.left,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  reviewsContainer: {
    padding: 20,
    width: imageWidth,
    marginHorizontal: imageMargin.right,
    marginLeft: imageMargin.left,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 30,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default RestaurantDetails; 