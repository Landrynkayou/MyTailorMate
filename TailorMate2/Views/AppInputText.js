import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this package installed or use another icon library
import tw  from 'twrnc';

const AppInputText = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error, 
  icon 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleToggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={tw`mb-4`}>
      <View style={[
        tw`flex-row items-center border rounded-lg p-2 w-full`, 
        error ? tw`border-red-500 bg-gray-200` : tw`border-gray-300 bg-gray-200`
      ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={[
            tw`flex-1 px-3 text-base text-gray-800 h-12`,
            error && tw`border-red-500`
          ]}
          placeholderTextColor="#95a5a6" // Light gray for placeholder
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={handleToggleVisibility} style={tw`p-2`}>
            <FontAwesome 
              name={isPasswordVisible ? 'eye' : 'eye-slash'} 
              size={20} 
              color="#3498db" // Blue color for the eye icon
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>}
    </View>
  );
};

export default AppInputText;
