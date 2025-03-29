import { View, ImageBackground, TextInput, StyleSheet, Animated, Dimensions, TouchableOpacity, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';

export default function MainScreen() {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const titleAnimation = new Animated.Value(1);
  const optionsAnimation = new Animated.Value(0);
  const searchBarAnimation = new Animated.Value(0);

  const handleTitlePress = () => {
    setShowOptions(true);
    Animated.timing(optionsAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleOptionSelect = (value: boolean) => {
    setSelectedOption(value);
    setShowOptions(false);
    
    Animated.sequence([
      Animated.timing(optionsAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleAnimation, {
          toValue: value ? 0.8 : 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(searchBarAnimation, {
          toValue: value ? 1 : 0,
          duration: value ? 500 : 300,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      if (!value) {
        // Reset state after animation completes if false is selected
        setSelectedOption(null);
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" hidden={true} />
      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.8}>
                <Animated.View 
                  style={[
                    styles.titleContainer,
                    {
                      transform: [
                        {
                          translateY: titleAnimation.interpolate({
                            inputRange: [0.8, 1],
                            outputRange: [-80, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Text style={[
                    styles.titleText,
                    selectedOption === true && styles.greenText,
                    selectedOption === false && styles.redText,
                  ]}>Bool</Text>
                  <Text style={styles.titleText}>k</Text>
                </Animated.View>
              </TouchableOpacity>

              {showOptions && (
                <Animated.View 
                  style={[
                    styles.optionsContainer,
                    {
                      opacity: optionsAnimation,
                      transform: [{ scale: optionsAnimation }]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={[styles.optionButton, styles.trueButton]} 
                    onPress={() => handleOptionSelect(true)}
                  >
                    <Text style={styles.optionText}>True</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.optionButton, styles.falseButton]} 
                    onPress={() => handleOptionSelect(false)}
                  >
                    <Text style={styles.optionText}>False</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {selectedOption === true && (
                <Animated.View 
                  style={[
                    styles.searchContainer,
                    {
                      opacity: searchBarAnimation,
                      transform: [
                        {
                          translateY: searchBarAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Wpisz adres dostawy..."
                    placeholderTextColor="#666"
                  />
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -width * 0.4 }],
    width: width * 0.8,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 180,
    fontWeight: '900',
    color: 'black',
  },
  greenText: {
    color: '#2ecc71',
  },
  redText: {
    color: '#e74c3c',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  trueButton: {
    backgroundColor: '#2ecc71',
  },
  falseButton: {
    backgroundColor: '#e74c3c',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 30,
  },
  searchBar: {
    height: 60,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#333',
  },
}); 