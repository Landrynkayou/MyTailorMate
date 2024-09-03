import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Tailor St, Fashion City, FC 12345',
    specialization: 'Custom Suits',
    photo: null,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChange = (key, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        photo: result.uri,
      }));
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row justify-between items-center bg-blue-500 py-4 px-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-white`}>Profile</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : handleEdit}>
          <Text style={tw`text-lg text-white`}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`items-center mt-5 mb-5`}>
        <TouchableOpacity onPress={handlePickImage}>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={tw`w-24 h-24 rounded-full`} />
          ) : (
            <View style={tw`w-24 h-24 bg-gray-300 rounded-full justify-center items-center`}>
              <Feather name="camera" size={40} color="#3498db" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={tw`bg-white rounded-lg p-4 mx-4`}>
        <InfoItem 
          icon="user" 
          label="Name" 
          value={profile.name} 
          isEditing={isEditing}
          onChangeText={(text) => handleChange('name', text)}
        />
        <InfoItem 
          icon="mail" 
          label="Email" 
          value={profile.email} 
          isEditing={isEditing}
          onChangeText={(text) => handleChange('email', text)}
        />
        <InfoItem 
          icon="phone" 
          label="Phone" 
          value={profile.phone} 
          isEditing={isEditing}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <InfoItem 
          icon="map-pin" 
          label="Address" 
          value={profile.address} 
          isEditing={isEditing}
          onChangeText={(text) => handleChange('address', text)}
        />
        <InfoItem 
          icon="scissors" 
          label="Specialization" 
          value={profile.specialization} 
          isEditing={isEditing}
          onChangeText={(text) => handleChange('specialization', text)}
        />
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, label, value, isEditing, onChangeText }) => (
  <View style={tw`flex-row items-center mb-4`}>
    <Feather name={icon} size={24} color="#3498db" style={tw`mr-4`} />
    <View style={tw`flex-1`}>
      <Text style={tw`text-sm text-gray-500 mb-1`}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={tw`text-base text-gray-800 border-b border-blue-500 py-1`}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={tw`text-base text-gray-800`}>{value}</Text>
      )}
    </View>
  </View>
);

export default ProfileScreen;
