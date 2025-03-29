import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, useWindowDimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Restaurant data structure from Firestore
interface RestaurantAnalysis {
  restaurantName: string;
  compareFun: number;
  aiComment: string;
  id?: string;
}

interface FirestoreData {
  timestamp: any;
  data: {
    analysisResults: RestaurantAnalysis[];
  };
}

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
  const [restaurant, setRestaurant] = useState<RestaurantAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation refs
  const starAnimations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const descriptionAnimation = useRef(new Animated.Value(0)).current;
  const reviewsAnimation = useRef(new Animated.Value(0)).current;
  const imageAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        // Get the latest analysis from Firestore
        const latestDocRef = doc(db, "restaurant-analysis", "latest");
        const latestDocSnap = await getDoc(latestDocRef);
        
        if (latestDocSnap.exists()) {
          const data = latestDocSnap.data() as FirestoreData;
          // Extract the restaurant ID from the URL parameter (format: restaurant-X)
          const idParts = typeof id === 'string' ? id.split('-') : [];
          const index = idParts.length > 1 ? parseInt(idParts[1]) : -1;
          
          if (index >= 0 && index < data.data.analysisResults.length) {
            // Found the restaurant
            setRestaurant(data.data.analysisResults[index]);
          } else {
            setError("Restaurant not found");
          }
        } else {
          setError("No restaurant data available");
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  useEffect(() => {
    if (!restaurant || loading) return;
    
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
  }, [restaurant, loading]);

  // Helper function to handle back navigation
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || "Restaurant not found"}</Text>
      </View>
    );
  }

  // Generate a random rating for visualization (since we don't have this in Firestore data)
  // In a real app, you would have actual ratings
  const rating = Math.min(5, Math.max(1, Math.round(restaurant.compareFun * 5 / 1.5)));

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={24} 
          color="#fff" 
          style={styles.backButton}
          onPress={handleBack}
        />
      </View>
      
      {!isSmallScreen && (
        <View style={[
          styles.imageContainer,
          {
            paddingTop: isLargeScreen ? 40 : 20,
            marginBottom: isLargeScreen ? 40 : 30,
          }
        ]}>
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" }}
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
        styles.detailsCard,
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
          backgroundColor: isSmallScreen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)',
          paddingTop: isSmallScreen ? 0 : (isLargeScreen ? 30 : 20),
          borderRadius: isLargeScreen ? 16 : 12,
          marginBottom: isLargeScreen ? 40 : 30,
        },
      ]}>
        {isSmallScreen && (
          <Animated.Image
            source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" }}
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
              color: '#fff',
              fontSize: isLargeScreen ? 36 : 28,
            }
          ]}>{restaurant.restaurantName}</Text>
          
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
                  name={index < rating ? 'star' : 'star-border'}
                  size={isLargeScreen ? 32 : 24}
                  color="#FFD700"
                />
              </Animated.View>
            ))}
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Boolk Meter Score:</Text>
            <Text style={styles.scoreValue}>{restaurant.compareFun.toFixed(2)}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[
        styles.section,
        {
          opacity: descriptionAnimation,
          transform: [{
            translateY: descriptionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          width: imageWidth,
          marginHorizontal: imageMargin.right,
          marginLeft: imageMargin.left,
        }
      ]}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="description" size={24} color="#2ecc71" />
          <Text style={styles.sectionTitle}>AI Analysis</Text>
        </View>
        <Text style={styles.description}>{restaurant.aiComment}</Text>
      </Animated.View>

      <Animated.View style={[
        styles.section,
        {
          opacity: reviewsAnimation,
          transform: [{
            translateY: reviewsAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
          width: imageWidth,
          marginHorizontal: imageMargin.right,
          marginLeft: imageMargin.left,
        }
      ]}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="info" size={24} color="#2ecc71" />
          <Text style={styles.sectionTitle}>Restaurant Information</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="local-dining" size={20} color="#2ecc71" />
          <Text style={styles.infoText}>Value for money: Excellent</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="people" size={20} color="#2ecc71" />
          <Text style={styles.infoText}>Popular with students</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="local-offer" size={20} color="#2ecc71" />
          <Text style={styles.infoText}>Affordable prices</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantImage: {
    borderRadius: 16,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  headerBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerContent: {
    zIndex: 1,
  },
  restaurantName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  star: {
    marginRight: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
    fontSize: 16,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});

export default RestaurantDetails; 