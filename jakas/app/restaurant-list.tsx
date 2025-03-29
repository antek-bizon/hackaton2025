import React from 'react';
import { View, StyleSheet } from 'react-native';
import RestaurantList from './components/RestaurantList';

export default function RestaurantListScreen() {
  return (
    <View style={styles.container}>
      <RestaurantList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 