import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

function AppButton({ 
  title, 
  onPress, 
  color = "dodgerblue", 
  textColor = "white", 
  width = 250, 
  height = 50, 
  style = {},
  textStyle = {}
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
            backgroundColor: color, width, height,
    


        },
        style
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default AppButton;
