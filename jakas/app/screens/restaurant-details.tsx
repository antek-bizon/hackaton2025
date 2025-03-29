import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { restaurants } from '../data/restaurants';

const { width: screenWidth } = Dimensions.get('window');
const imageWidth = screenWidth * 0.8; // 80% of screen width
const imageHeight = screenWidth * 0.2; // 20% of screen width
const imageMargin = (screenWidth - imageWidth) / 2; // 10% margin on each side

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams();
  const restaurant = restaurants.find(r => r.id === id);
  const starAnimations = useRef([...Array(10)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate stars sequentially
    starAnimations.forEach((animation, index) => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.spring(animation, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    });
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
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(10)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.star,
                {
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

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{restaurant.description}</Text>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        {restaurant.reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
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
      </View>
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
  },
  restaurantImage: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 12,
    marginHorizontal: imageMargin,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  reviewsContainer: {
    padding: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewItem: {
    backgroundColor: '#f8f8f8',
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
  reviewAuthor: {
    fontSize: 16,
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