import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

interface OpeningHours {
  open: string;
  close: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  price_range: string;
  address: string;
  opening_time: string;
  closing_time: string;
  image_url: string;
  review: number | null;
  reviews?: Review[];
}

const checkIfOpen = (openingHours: OpeningHours): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [openHour, openMinute] = openingHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = openingHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

const RestaurantDetails = () => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isSmallScreen = windowWidth < 768;
  const isLargeScreen = windowWidth >= 1024;
  
  // Calculate dynamic dimensions
  const imageWidth = windowWidth * (isLargeScreen ? 0.7 : 0.85);
  const imageHeight = windowWidth * (isLargeScreen ? 0.15 : 0.2);
  const leftMargin = (windowWidth - imageWidth) / 2;
  const rightMargin = leftMargin;

  const imageMargin = { left: leftMargin, right: rightMargin };

  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const starAnimations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const descriptionAnimation = useRef(new Animated.Value(0)).current;
  const reviewsAnimation = useRef(new Animated.Value(0)).current;
  const imageAnimation = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/restaurants`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details');
      }
      const restaurants: Restaurant[] = await response.json();
      const restaurant = restaurants.find((r: Restaurant) => r.id === Number(id));
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      setRestaurant(restaurant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animate image first
    Animated.timing(imageAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animate sections first
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(headerAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(reviewsAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate stars last, after sections are fully visible
    Animated.sequence([
      Animated.delay(500),
      Animated.stagger(100,
        starAnimations.map(animation =>
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Check if restaurant is open using the proper opening hours
    const checkOpenStatus = () => {
      if (!restaurant) return;
      const isOpen = checkIfOpen({
        open: restaurant.opening_time,
        close: restaurant.closing_time
      });
      setIsOpen(isOpen);
    };

    checkOpenStatus();
    return () => {
      clearInterval(timer);
    };
  }, [restaurant]);

  const getTodayHours = (openingHours: OpeningHours) => {
    return `${openingHours.open} - ${openingHours.close}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!isSmallScreen && (
        <View style={[
          styles.imageContainer,
          {
            paddingTop: isLargeScreen ? 40 : 20,
            marginBottom: isLargeScreen ? 40 : 30,
          }
        ]}>
          <Animated.Image
            source={{ uri: restaurant.image_url }}
            style={[
              styles.restaurantImage,
              {
                padding: 0,
                width: imageWidth,
                height: imageHeight,
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
          width: imageWidth,
          marginHorizontal: imageMargin.right,
          marginLeft: imageMargin.left,
          opacity: headerAnimation,
          transform: [{
            translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          backgroundColor: isSmallScreen ? 'transparent' : '#f8f8f8',
          paddingTop: isSmallScreen ? 0 : (isLargeScreen ? 30 : 20),
          borderRadius: isLargeScreen ? 16 : 12,
          marginBottom: isLargeScreen ? 40 : 30,
        },
      ]}>
        {isSmallScreen && (
          <Animated.Image
            source={{ uri: restaurant.image_url }}
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
            padding: isSmallScreen ? 20 : (isLargeScreen ? 30 : 20),
            borderRadius: isSmallScreen ? 12 : 0,
            width: '100%',
            paddingBottom: isLargeScreen ? 30 : 20,
          },
        ]}>
          <Text style={[
            styles.restaurantName,
            { 
              color: isSmallScreen ? '#fff' : '#000',
              fontSize: isLargeScreen ? 36 : 28,
            }
          ]}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
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
                  name={index < (restaurant.review || 0) ? 'star' : 'star-border'}
                  size={isLargeScreen ? 32 : 24}
                  color="#FFD700"
                />
              </Animated.View>
            ))}
          </View>
          <View style={[
            styles.hoursContainer,
            {
              marginTop: isLargeScreen ? 15 : 10,
              paddingHorizontal: isLargeScreen ? 16 : 12,
              paddingVertical: isLargeScreen ? 8 : 6,
            }
          ]}>
            <MaterialIcons
              name="access-time"
              size={isLargeScreen ? 24 : 20}
              color={isOpen ? (isSmallScreen ? '#fff' : '#000') : '#ff4444'}
            />
            <Text style={[
              styles.hoursText,
              {
                color: isOpen ? (isSmallScreen ? '#fff' : '#000') : '#ff4444',
                fontSize: isLargeScreen ? 18 : 16,
                marginLeft: isLargeScreen ? 12 : 8,
              }
            ]}>
              {isOpen ? 'Open' : 'Closed'} • {getTodayHours({
                open: restaurant.opening_time,
                close: restaurant.closing_time
              })}
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[
        styles.descriptionContainer,
        {
          width: imageWidth,
          marginHorizontal: imageMargin.right,
          marginLeft: imageMargin.left,
          opacity: descriptionAnimation,
          transform: [{
            translateY: descriptionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          padding: isLargeScreen ? 30 : 20,
          borderRadius: isLargeScreen ? 16 : 12,
          marginBottom: isLargeScreen ? 40 : 30,
        },
      ]}>
        <Text style={[
          styles.description,
          {
            fontSize: isLargeScreen ? 18 : 16,
            lineHeight: isLargeScreen ? 28 : 24,
          }
        ]}>{restaurant.description}</Text>
      </Animated.View>

      <Animated.View style={[
        styles.reviewsContainer,
        {
          width: imageWidth,
          marginHorizontal: imageMargin.right,
          marginLeft: imageMargin.left,
          opacity: reviewsAnimation,
          transform: [{
            translateY: reviewsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          padding: isLargeScreen ? 30 : 20,
          borderRadius: isLargeScreen ? 16 : 12,
          marginBottom: isLargeScreen ? 40 : 30,
        },
      ]}>
        <Text style={[
          styles.reviewsTitle,
          {
            fontSize: isLargeScreen ? 24 : 20,
            marginBottom: isLargeScreen ? 20 : 15,
          }
        ]}>Reviews</Text>
        {restaurant.reviews?.map((review) => (
          <View key={review.date} style={[
            styles.reviewItem,
            {
              padding: isLargeScreen ? 20 : 15,
              borderRadius: isLargeScreen ? 12 : 8,
              marginBottom: isLargeScreen ? 15 : 10,
            }
          ]}>
            <View style={styles.reviewHeader}>
              <Text style={[
                styles.reviewDate,
                {
                  fontSize: isLargeScreen ? 16 : 14,
                }
              ]}>{review.date}</Text>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, index) => (
                  <MaterialIcons
                    key={index}
                    name={index < review.rating ? 'star' : 'star-border'}
                    size={isLargeScreen ? 20 : 16}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
            <Text style={[
              styles.reviewComment,
              {
                fontSize: isLargeScreen ? 16 : 14,
                lineHeight: isLargeScreen ? 24 : 20,
              }
            ]}>{review.comment}</Text>
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
  contentContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantImage: {
    borderRadius: 12,
  },
  header: {
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
    backgroundColor: '#f8f8f8',
  },
  description: {
    color: '#333',
  },
  reviewsContainer: {
    backgroundColor: '#f8f8f8',
  },
  reviewsTitle: {
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#fff',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewDate: {
    color: '#666',
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: '#666',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  hoursText: {
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#ff4444',
  },
});

export default RestaurantDetails; 