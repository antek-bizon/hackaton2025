import { Text, View, ImageBackground, TextInput, StyleSheet } from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Boolk</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Wpisz adres dostawy..."
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

// Hide the header
Index.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginBottom: 40,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    width: '80%',
    maxWidth: 400,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  searchBar: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
});
