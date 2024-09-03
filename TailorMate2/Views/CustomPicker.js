import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Using MaterialCommunityIcons for more diverse icons
import tw from 'twrnc';

const { width } = Dimensions.get('window');

const RoleOption = ({ title, description, color, icon, onPress }) => (
  <TouchableOpacity
    style={[tw`rounded-2xl p-5 mb-5 items-center w-full`, { backgroundColor: color }]}
    onPress={onPress}
  >
    <View style={tw`w-20 h-20 rounded-full bg-white bg-opacity-30 items-center justify-center mb-4`}>
      <MaterialCommunityIcons name={icon} size={40} color="#fff" />
    </View>
    <Text style={tw`text-2xl font-bold text-white mb-2`}>{title}</Text>
    <Text style={tw`text-base text-white opacity-90 text-center`}>{description}</Text>
  </TouchableOpacity>
);

const RolePickerScreen = ({ navigation }) => {
  const handleRoleSelect = (role) => {
    navigation.navigate('Signup', { role });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <View style={tw`flex-1 justify-center items-center p-5`}>
        <Text style={tw`text-4xl font-bold text-gray-800 mb-2 text-center`}>Choose Your Role</Text>
        <Text style={tw`text-lg text-gray-600 mb-6 text-center`}>Select the option that best describes you</Text>
        
        <View style={tw`w-full max-w-lg`}>
          <RoleOption
            title="Customer"
            description="I'm looking for tailoring services"
            color="#F5A623"
            icon="hanger"
            onPress={() => handleRoleSelect('Customer')}
          />
          
          <RoleOption
            title="Tailor"
            description="I provide tailoring services"
            color="#7B0BE3"
            icon="scissors-cutting"
            onPress={() => handleRoleSelect('Tailor')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RolePickerScreen;
