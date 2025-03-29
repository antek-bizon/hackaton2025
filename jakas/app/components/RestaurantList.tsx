import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface OpeningHours {
  open: string;
  close: string;
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

export default function RestaurantList() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = React.useRef(new Animated.Value(1)).current;
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRestaurantPress = (id: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push(`/screens/restaurant-details?id=${id}`);
    });
  };

  const handleBackPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animacja wyjścia
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        router.replace('/');
      });
    });
  };

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => {
    const isOpen = checkIfOpen({
      open: item.opening_time,
      close: item.closing_time
    });
    
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable 
          style={({ pressed }) => [
            styles.restaurantCard,
            pressed && styles.cardPressed,
            !isOpen && styles.closedRestaurantCard,
          ]}
          onPress={() => handleRestaurantPress(item.id)}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
          <View style={styles.cardContent}>
            <View style={styles.restaurantHeader}>
              <View style={styles.nameContainer}>
                <Text style={[styles.restaurantName, !isOpen && styles.closedText]}>{item.name}</Text>
                <View style={styles.cuisineTag}>
                  <Text style={[styles.cuisineText, !isOpen && styles.closedText]}>{item.cuisine}</Text>
                </View>
              </View>
              <View style={styles.upperRightContainer}>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <MaterialIcons
                      key={index}
                      name={index < (item.review || 0) ? 'star' : 'star-border'}
                      size={16}
                      color={!isOpen ? '#999' : '#FFD700'}
                    />
                  ))}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceText, !isOpen && styles.closedText]}>
                    {item.price_range === 'budget' ? '€' : item.price_range === 'moderate' ? '€€' : '€€€'}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={[styles.restaurantDescription, !isOpen && styles.closedText]} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.bottomContainer}>
              <View style={styles.leftInfoContainer}>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="location-on" size={16} color={!isOpen ? '#999' : '#666'} />
                  <Text style={[styles.infoText, !isOpen && styles.closedText]}>{item.address}</Text>
                </View>
              </View>
              <View style={styles.rightInfoContainer}>
                <View style={styles.hoursContainer}>
                  <MaterialIcons 
                    name="access-time" 
                    size={14} 
                    color={!isOpen ? '#999' : '#666'} 
                  />
                  <Text style={[styles.hoursText, !isOpen && styles.closedText]}>
                    {item.opening_time} - {item.closing_time}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <MaterialIcons 
                    name={isOpen ? 'check-circle' : 'cancel'} 
                    size={16} 
                    color={isOpen ? '#4CAF50' : '#F44336'} 
                  />
                  <Text style={[styles.infoText, { color: isOpen ? '#4CAF50' : '#F44336' }]}>
                    {isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading restaurants...</Text>
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

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.background,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.headerContainer}>
          <Animated.View
            style={{
              transform: [{ scale: buttonScaleAnim }]
            }}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Best Restaurants</Text>
            <Text style={styles.subtitle}>Discover exceptional flavors</Text>
          </View>
        </View>
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgb(46, 204, 113)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  restaurantCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardContent: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cuisineTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cuisineText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  upperRightContainer: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  priceContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  rightInfoContainer: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  closedRestaurantCard: {
    opacity: 0.8,
  },
  closedText: {
    color: '#999',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hoursText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
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