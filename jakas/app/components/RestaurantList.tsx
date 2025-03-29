import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Pressable } from 'react-native';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { analyzeRestaurants } from '../../config/gemini';
import { router } from 'expo-router';

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

const RestaurantList = ({ onBack }: RestaurantListProps) => {
  const [restaurants, setRestaurants] = useState<RestaurantAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Powrót</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Ranking Restauracji wg. Boolk</Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={handleAnalyze}
          disabled={analyzing}
        >
          <Text style={styles.analyzeButtonText}>
            {analyzing ? 'Analizowanie...' : 'Odśwież Analizę'}
          </Text>
        </TouchableOpacity>
      </View>

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
        <ScrollView style={styles.scrollView}>
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
                          outputRange: [50, 0],
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
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Wskaźnik Boolk:</Text>
                    <Text style={styles.scoreValue}>{restaurant.compareFun.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.aiComment}>{restaurant.aiComment}</Text>
                  
                  <View style={styles.detailsContainer}>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => handleRestaurantPress(restaurant.id || 'default')}
                    >
                      <Text style={styles.detailsButtonText}>Zobacz szczegóły</Text>
                    </TouchableOpacity>
                  </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#2ecc71',
    fontSize: 16,
  },
  scrollView: {
    padding: 16,
  },
  restaurantCardContainer: {
    marginBottom: 16,
  },
  restaurantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: [{ scale: 0.98 }],
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    paddingRight: 40,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  aiComment: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  detailsButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  detailsButtonText: {
    color: '#2ecc71',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyStateText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    lineHeight: 20,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  analyzeButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestaurantList; 