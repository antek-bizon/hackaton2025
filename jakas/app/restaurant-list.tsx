import React from 'react';
import { View, StyleSheet } from 'react-native';
import RestaurantList from './components/RestaurantList';
import { router } from 'expo-router';

export default function RestaurantListScreen() {
  const handleBack = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <RestaurantList onBack={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 