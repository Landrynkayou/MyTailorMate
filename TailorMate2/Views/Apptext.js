import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AppText({ 
  title, 
  subtitle, 
  titleStyle, 
  subtitleStyle, 
  containerStyle,
  numberOfLines,
  onPress
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text 
        style={[styles.title, titleStyle]} 
        numberOfLines={numberOfLines}
        onPress={onPress}
      >
        {title}
      </Text>
      {subtitle && (
        <Text 
          style={[styles.subtitle, subtitleStyle]}
          numberOfLines={numberOfLines}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default AppText;