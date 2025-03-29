import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Pressable, Dimensions } from 'react-native';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { analyzeRestaurants } from '../../config/gemini';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

// Define the restaurant data structure
interface RestaurantAnalysis {
  restaurantName: string;
  compareFun: number;
  aiComment: string;
  id?: string; // Add optional ID for routing
}

interface FirestoreData {
  timestamp: any;
  data: {
    analysisResults: RestaurantAnalysis[];
  };
}

interface RestaurantListProps {
  onBack?: () => void;
}

const { width, height } = Dimensions.get('window');

const RestaurantList = ({ onBack }: RestaurantListProps) => {
  const [restaurants, setRestaurants] = useState<RestaurantAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const headerAnim = React.useRef(new Animated.Value(0)).current;
  
  // Animation for header and action bar
  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  
  useEffect(() => {
    // Animation sequence on mount
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
    
    const fetchRestaurantsFromFirestore = async () => {
      try {
        setLoading(true);
        // Get the latest analysis from Firestore
        const latestDocRef = doc(db, "restaurant-analysis", "latest");
        const latestDocSnap = await getDoc(latestDocRef);
        
        if (latestDocSnap.exists()) {
          const data = latestDocSnap.data() as FirestoreData;
          // Add IDs to each restaurant for navigation
          const restaurantsWithIds = data.data.analysisResults.map((restaurant, index) => ({
            ...restaurant,
            id: `restaurant-${index}`
          }));
          setRestaurants(restaurantsWithIds);
        } else {
          // If no data, set empty array
          setRestaurants([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Nie udało się pobrać danych restauracji.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantsFromFirestore();
  }, []);

  // Handle restaurant item press
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

  // Sort restaurants by compareFun in descending order (highest value first)
  const sortedRestaurants = [...restaurants].sort((a, b) => 
    b.compareFun - a.compareFun
  );

  // Add function to handle analysis
  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await analyzeRestaurants();
      // Refetch data after analysis
      const latestDocRef = doc(db, "restaurant-analysis", "latest");
      const latestDocSnap = await getDoc(latestDocRef);
      
      if (latestDocSnap.exists()) {
        const data = latestDocSnap.data() as FirestoreData;
        // Add IDs to each restaurant for navigation
        const restaurantsWithIds = data.data.analysisResults.map((restaurant, index) => ({
          ...restaurant,
          id: `restaurant-${index}`
        }));
        setRestaurants(restaurantsWithIds);
      }
      setError(null);
    } catch (err) {
      console.error("Error analyzing restaurants:", err);
      setError("Nie udało się przeprowadzić analizy restauracji.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Get gradient colors based on restaurant rank
  const getGradientColors = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#2ecc71', '#27ae60'], // Green - 1st
      ['#3498db', '#2980b9'], // Blue - 2nd
      ['#9b59b6', '#8e44ad'], // Purple - 3rd
      ['#f1c40f', '#f39c12'], // Yellow - 4th
      ['#e67e22', '#d35400'], // Orange - 5th
      ['#e74c3c', '#c0392b'], // Red - others
    ];
    return index < 5 ? gradients[index] : gradients[5];
  };

  // Function to render dynamic background patterns
  const renderBackgroundPatterns = () => (
    <View style={styles.backgroundPatterns}>
      <View style={[styles.pattern, styles.pattern1]} />
      <View style={[styles.pattern, styles.pattern2]} />
      <View style={[styles.pattern, styles.pattern3]} />
      <View style={[styles.pattern, styles.pattern4]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderBackgroundPatterns()}
      
      {/* Header with glass effect */}
      <Animated.View 
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerTranslateY }] }
        ]}
      >
        <BlurView intensity={30} style={styles.blurContainer}>
          <LinearGradient 
            colors={['rgba(46, 204, 113, 0.9)', 'rgba(46, 204, 113, 0.7)']} 
            style={styles.header}
          >
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Boolk Meter</Text>
              <Text style={styles.headerSubtitle}>Ranking restauracji</Text>
            </View>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="refresh" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      {loading || analyzing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>
            {analyzing ? 'Analizowanie restauracji...' : 'Wczytywanie restauracji...'}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedRestaurants.length > 0 ? (
            sortedRestaurants.map((restaurant, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.restaurantCardContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50 + (index * 20), 0],
                        }),
                      },
                    ],
                  }
                ]}
              >
                <Pressable 
                  style={({ pressed }) => [
                    styles.restaurantCard,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => handleRestaurantPress(restaurant.id || 'default')}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <LinearGradient
                    colors={getGradientColors(index)}
                    style={styles.cardGradient}
                  >
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    
                    <View style={styles.cardContent}>
                      <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
                      
                      <View style={styles.scoreContainer}>
                        <MaterialIcons name="star" size={20} color="#FFD700" />
                        <Text style={styles.scoreValue}>{restaurant.compareFun.toFixed(2)}</Text>
                      </View>
                      
                      <Text style={styles.aiComment} numberOfLines={2}>{restaurant.aiComment}</Text>
                      
                      <View style={styles.detailsContainer}>
                        <TouchableOpacity 
                          style={styles.detailsButton}
                          onPress={() => handleRestaurantPress(restaurant.id || 'default')}
                        >
                          <Text style={styles.detailsButtonText}>Zobacz szczegóły</Text>
                          <MaterialIcons name="arrow-forward" size={16} color="#2ecc71" style={styles.detailsIcon} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Brak dostępnych restauracji. Spróbuj później lub wróć do strony głównej.
              </Text>
            </View>
          )}
          
          {/* Add some padding at the bottom */}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backgroundPatterns: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pattern: {
    position: 'absolute',
    borderRadius: 300,
    opacity: 0.2,
  },
  pattern1: {
    top: -150,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: '#2ecc71',
    transform: [{ rotate: '45deg' }],
  },
  pattern2: {
    bottom: -200,
    left: -150,
    width: 350,
    height: 350,
    backgroundColor: '#3498db',
    transform: [{ rotate: '30deg' }],
  },
  pattern3: {
    top: height * 0.4,
    left: -120,
    width: 200,
    height: 200,
    backgroundColor: '#f39c12',
    transform: [{ rotate: '60deg' }],
  },
  pattern4: {
    bottom: 100,
    right: -80,
    width: 180,
    height: 180,
    backgroundColor: '#9b59b6',
    transform: [{ rotate: '15deg' }],
  },
  headerContainer: {
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  blurContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: 140, // Account for header height
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  restaurantCardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  restaurantCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(25, 25, 25, 0.7)',
  },
  cardGradient: {
    width: '100%',
    height: '100%',
    paddingTop: 70,
    paddingBottom: 20,
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContent: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    paddingRight: 40,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 6,
  },
  aiComment: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    marginTop: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  detailsButtonText: {
    color: '#2ecc71',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 20,
  },
  emptyStateText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    lineHeight: 20,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default RestaurantList; 