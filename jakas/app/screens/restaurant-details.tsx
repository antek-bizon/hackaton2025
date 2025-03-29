import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, useWindowDimensions, ActivityIndicator, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width >= 1024;
  
  // Animation refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const starAnimations = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<RestaurantAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY] = useState(new Animated.Value(0));
  
  // Header animation based on scroll
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 80, 170],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  // Title animation
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 120, 200],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp'
  });
  
  // Header shadow
  const headerShadow = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 20],
    extrapolate: 'clamp'
  });

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
    
    // Staggered entrance animations
    Animated.sequence([
      // First animate the header
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Then animate the content
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]),
      
      // Finally animate the stars
      Animated.stagger(100,
        starAnimations.map(animation =>
          Animated.spring(animation, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          })
        )
      )
    ]).start();
  }, [restaurant, loading]);

  // Helper function to handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Generate a rating for visualization
  const rating = Math.min(5, Math.max(1, Math.round((restaurant?.compareFun || 0) * 5 / 1.5)));

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
        <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Restaurant not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.headerBackground,
          {
            opacity: headerBackgroundOpacity,
            shadowOpacity: headerShadow,
          }
        ]}
      >
        <BlurView intensity={70} style={styles.blurContainer} />
      </Animated.View>
      
      {/* Header elements */}
      
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Content Cards */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }]
            }
          ]}
        >
          {/* Restaurant Info Card */}
          <View style={styles.restaurantInfoCard}>
            <Text style={styles.restaurantNameLarge}>{restaurant?.restaurantName}</Text>
            
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: starAnimations[index],
                    transform: [{ scale: starAnimations[index] }],
                  }}
                >
                  <MaterialIcons
                    name={index < rating ? 'star' : 'star-border'}
                    size={28}
                    color="#FFD700"
                    style={styles.starIcon}
                  />
                </Animated.View>
              ))}
            </View>
            
            <View style={styles.boolkScoreContainer}>
              <MaterialIcons name="emoji-events" size={20} color="#fff" />
              <Text style={styles.boolkScoreLabel}>Boolk Meter Score:</Text>
              <Text style={styles.boolkScoreValue}>{restaurant?.compareFun?.toFixed(2) ?? '0.00'}</Text>
            </View>
          </View>
          
          {/* AI Analysis Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="auto-awesome" size={24} color="#2ecc71" />
              <Text style={styles.sectionTitle}>AI Analysis</Text>
            </View>
            <Text style={styles.aiComment}>{restaurant?.aiComment}</Text>
          </View>
          
          {/* Value Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="money" size={24} color="#2ecc71" />
              <Text style={styles.sectionTitle}>Value for Money</Text>
            </View>
            
            <View style={styles.valueBar}>
              <View style={[styles.valueBarFill, { width: `${Math.min((restaurant?.compareFun || 0) * 60, 100)}%` }]} />
              <View style={styles.valueLabels}>
                <Text style={styles.valueLabel}>Poor</Text>
                <Text style={styles.valueLabel}>Average</Text>
                <Text style={styles.valueLabel}>Excellent</Text>
              </View>
            </View>
            
            <View style={styles.valueFactors}>
              <View style={styles.valueFactor}>
                <MaterialIcons name="restaurant" size={20} color="#2ecc71" />
                <Text style={styles.valueFactorText}>
                  {(restaurant?.compareFun || 0) > 0.8 ? 'Large portions' : 
                  (restaurant?.compareFun || 0) > 0.5 ? 'Average portions' : 'Small portions'}
                </Text>
              </View>
              
              <View style={styles.valueFactor}>
                <MaterialIcons name="attach-money" size={20} color="#2ecc71" />
                <Text style={styles.valueFactorText}>
                  {(restaurant?.compareFun || 0) > 0.8 ? 'Reasonable price' : 
                  (restaurant?.compareFun || 0) > 0.5 ? 'Average price' : 'Expensive for what you get'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Recommendation Section */}
          <View style={[styles.sectionCard, styles.recommendationCard]}>
            <MaterialIcons 
              name={(restaurant?.compareFun || 0) > 0.8 ? "thumb-up" : 
                   (restaurant?.compareFun || 0) > 0.5 ? "thumbs-up-down" : "thumb-down"} 
              size={40} 
              color={(restaurant?.compareFun || 0) > 0.8 ? "#2ecc71" : 
                   (restaurant?.compareFun || 0) > 0.5 ? "#f39c12" : "#e74c3c"} 
              style={styles.recommendationIcon}
            />
            <Text style={styles.recommendationText}>
              {(restaurant?.compareFun || 0) > 0.8 ? 'Najesz się niewielkim kosztem' : 
               (restaurant?.compareFun || 0) > 0.5 ? 'Mogłoby być lepiej' : 'Dużo wydasz i się nie najesz'}
            </Text>
          </View>
          
          {/* Info Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={24} color="#2ecc71" />
              <Text style={styles.sectionTitle}>Restaurant Information</Text>
            </View>
            <View style={styles.infoItems}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="people" size={20} color="#2ecc71" />
                </View>
                <Text style={styles.infoText}>Popular with students</Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="restaurant-menu" size={20} color="#2ecc71" />
                </View>
                <Text style={styles.infoText}>
                  {(restaurant?.compareFun || 0) > 0.7 ? 'Diverse menu' : 'Limited menu options'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="local-dining" size={20} color="#2ecc71" />
                </View>
                <Text style={styles.infoText}>
                  {rating >= 4 ? 'High quality food' : 
                   rating >= 3 ? 'Good quality food' : 'Average quality food'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButtonLarge, styles.primaryButton]}>
              <MaterialIcons name="restaurant-menu" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>View Menu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButtonLarge, styles.secondaryButton]}>
              <MaterialIcons name="directions" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
          
          {/* Bottom Padding */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 90,
    backgroundColor: '#2ecc71',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 55 : 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 110 : 100,
  },
  restaurantInfoCard: {
    padding: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantNameLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  boolkScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.5)',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  boolkScoreLabel: {
    color: '#fff',
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  boolkScoreValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(46, 204, 113, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  aiComment: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  valueBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 6,
    marginTop: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  valueBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#2ecc71',
    borderRadius: 4,
  },
  valueLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  valueLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  valueFactors: {
    marginTop: 15,
  },
  valueFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  valueFactorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
    fontSize: 15,
  },
  recommendationCard: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderColor: 'rgba(46, 204, 113, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  recommendationIcon: {
    marginRight: 20,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 50,
  },
  recommendationText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(46, 204, 113, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  infoItems: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
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
  errorBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  actionButtonLarge: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  secondaryButtonText: {
    color: '#fff',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
});

export default RestaurantDetails; 