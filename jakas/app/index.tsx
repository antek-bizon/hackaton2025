import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { restaurants, Restaurant, OpeningHours } from './data/restaurants';

type DayOfWeek = keyof OpeningHours;

const checkIfOpen = (openingHours: OpeningHours): boolean => {
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayHours = openingHours[days[day]];
  
  if (!todayHours) return false;
  
  const [openHour, openMinute] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

export default function Home() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [localRestaurants, setLocalRestaurants] = useState<Restaurant[]>(restaurants);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const updateRestaurants = () => {
      const updatedRestaurants = [...restaurants].sort((a, b) => {
        const aIsOpen = checkIfOpen(a.openingHours);
        const bIsOpen = checkIfOpen(b.openingHours);
        if (aIsOpen === bIsOpen) return 0;
        return aIsOpen ? -1 : 1;
      });
      setLocalRestaurants(updatedRestaurants);
    };

    updateRestaurants();
    const interval = setInterval(updateRestaurants, 60000); // Aktualizuj co minutę

    return () => clearInterval(interval);
  }, []);

  const handleRestaurantPress = (id: string) => {
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

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => {
    const isOpen = checkIfOpen(item.openingHours);
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayHours = item.openingHours[days[new Date().getDay()]];
    
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
          <View style={styles.cardGradient}>
            <View style={styles.restaurantHeader}>
              <View style={styles.nameContainer}>
                <Text style={[styles.restaurantName, !isOpen && styles.closedText]}>{item.name}</Text>
                <View style={styles.cuisineTag}>
                  <Text style={[styles.cuisineText, !isOpen && styles.closedText]}>{item.cuisine}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <MaterialIcons
                    key={index}
                    name={index < item.rating ? 'star' : 'star-border'}
                    size={16}
                    color={!isOpen ? '#999' : '#FFD700'}
                  />
                ))}
              </View>
            </View>
            
            <Text style={[styles.restaurantDescription, !isOpen && styles.closedText]} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.restaurantFooter}>
              <View style={styles.infoContainer}>
                <MaterialIcons name="location-on" size={16} color={!isOpen ? '#999' : '#666'} />
                <Text style={[styles.infoText, !isOpen && styles.closedText]}>{item.address}</Text>
              </View>
              <View style={styles.infoContainer}>
                <MaterialIcons 
                  name={isOpen ? 'check-circle' : 'cancel'} 
                  size={16} 
                  color={isOpen ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[styles.infoText, { color: isOpen ? '#4CAF50' : '#F44336' }]}>
                  {isOpen ? 'Otwarte' : 'Zamknięte'}
                </Text>
              </View>
            </View>
            
            {todayHours && (
              <View style={styles.hoursContainer}>
                <Text style={[styles.hoursText, !isOpen && styles.closedText]}>
                  {todayHours.open} - {todayHours.close}
                </Text>
              </View>
            )}
            
            <View style={styles.priceContainer}>
              <Text style={[styles.priceText, !isOpen && styles.closedText]}>
                {item.priceRange === 'budget' ? '€' : item.priceRange === 'moderate' ? '€€' : '€€€'}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Najlepsze Restauracje</Text>
          <Text style={styles.subtitle}>Odkryj wyjątkowe smaki</Text>
        </View>
        <FlatList
          data={localRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
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
    overflow: 'hidden',
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
  cardGradient: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
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
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 40,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  priceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  closedRestaurantCard: {
    opacity: 0.8,
  },
  closedText: {
    color: '#999',
  },
  hoursContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  hoursText: {
    fontSize: 12,
    color: '#666',
  },
});
