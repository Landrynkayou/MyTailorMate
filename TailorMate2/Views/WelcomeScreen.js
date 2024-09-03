import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [animation] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0));
  const [currentScreen, setCurrentScreen] = useState(0);
  const [gradientColors, setGradientColors] = useState(['#4a90e2', '#3498db']);
  const flatListRef = React.useRef(null);

  const screens = [
    {
      title: "Get Tailored Clothes with Ease",
      description: "Order custom-made clothes from the comfort of your home with our easy-to-use app.",
      icon: "tshirt-crew-outline"
    },
    {
      title: "Track Your Orders",
      description: "Stay updated with the progress of your orders and receive notifications when they are ready.",
      icon: "truck-check-outline"
    }
  ];

  useEffect(() => {
    // Start animation for the screen content
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Start animation for the logo scaling
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentScreen(slideIndex);

    // Change the gradient colors based on the slide index
    if (slideIndex === 0) {
      setGradientColors(['#4a90e2', '#3498db']);
    } else if (slideIndex === 1) {
      setGradientColors(['#6a5acd', '#7a7bd5']); // Slight violet color
    } else {
      setGradientColors(['#8a2be2', '#9b59b6']); // More pronounced violet
    }
  };

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentScreen + 1 });
    } else {
      navigation.navigate('RolePicker');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.content}>
      <MaterialCommunityIcons name={item.icon} size={100} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <Animated.View style={[{ flex: 1 }, { opacity: animation }]}>
          
          {/* Animated Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <Text style={styles.logo}>TailorMate</Text>
          </Animated.View>

          <FlatList
            ref={flatListRef}
            data={screens}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </Animated.View>

        <TouchableOpacity style={styles.button} onPress={nextScreen}>
          <Text style={styles.buttonText}>
            {currentScreen === screens.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('RolePicker')}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentScreen ? styles.paginationDotActive : null
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#e6e6e6',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 80, // Adjusted to center it
  },
  buttonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 50, // Adjust based on where you want the logo to appear
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WelcomeScreen;
