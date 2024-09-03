import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CatalogScreen = () => {
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to add images to the catalog.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to add images to the catalog.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, { uri: result.uri }]);
    }
  };

  const addComment = (imageIndex, comment) => {
    setComments({ ...comments, [imageIndex]: comment });
  };

  const removeImage = (imageIndex) => {
    const newImages = [...images];
    newImages.splice(imageIndex, 1);
    setImages(newImages);

    const newComments = { ...comments };
    delete newComments[imageIndex];
    setComments(newComments);
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4 bg-white shadow-md`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>Catalog</Text>
       
      </View>
      <ScrollView contentContainerStyle={tw`px-4 py-6`}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <View key={index} style={tw`bg-white shadow-md rounded-md mb-6`}>
              <Image source={{ uri: image.uri }} style={tw`w-full h-48 rounded-md`} />
              <View style={tw`p-4 flex-row justify-between items-center`}>
                <TextInput
                  style={tw`border border-gray-300 rounded-md px-4 py-2 flex-1 mr-4`}
                  placeholder="Add a comment..."
                  value={comments[index] || ''}
                  onChangeText={(comment) => addComment(index, comment)}
                />
                <TouchableOpacity onPress={() => removeImage(index)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <Ionicons name="image-outline" size={48} color="gray" />
            <Text style={tw`text-gray-600 mt-4`}>No images in the catalog yet.</Text>
            <TouchableOpacity
          style={tw`bg-blue-500 h-10 px-4 py-2 rounded-md mt-2 absolute top-150 `}
          onPress={addImage}
        >
          <Text style={tw`text-white font-bold `}>Add Image</Text>
        </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
});

export default CatalogScreen;
