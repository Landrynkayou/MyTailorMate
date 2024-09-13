import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddClientScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [measurements, setMeasurements] = useState([{ height: '', weight: '', chestSize: '', waistSize: '', hipSize: '' }]);
  const [orders, setOrders] = useState([{ item: '', status: '' }]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params) {
      const { clientName, clientMeasurements, clientOrders } = route.params;
      if (clientName) setName(clientName);
      if (clientMeasurements) setMeasurements(clientMeasurements);
      if (clientOrders) setOrders(clientOrders);
    }
  }, [route]);

  const addClient = async () => {
    if (!name || measurements.some(m => !m.height || !m.weight || !m.chestSize || !m.waistSize || !m.hipSize) || orders.some(o => !o.item || !o.status)) {
        Alert.alert('Validation Error', 'Please fill in all the required fields.');
        return;
    }

    setLoading(true);

    try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userID');  // Fetching userID

        if (!token || !userId) {
            Alert.alert('Error', 'No authentication token or user ID found.');
            return;
        }

        const newClient = {
            name,
            measurements: measurements.map((measurement) => ({
                ...measurement,
                clientId: userId,  // Ensure clientId is included in each measurement
            })),
            orders: orders.map((order) => ({
                ...order,
                items: order.item,  // Replace `item` with `items`
                clientId: userId,  // Assign clientId for orders
                status: order.status === 'Start' ? 'Pending' : order.status,  // Fix invalid status
            })),
            image,
            userID: userId  // Ensure userID is included
        };

        const response = await fetch('http://192.168.1.190:5000/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newClient),
        });

        if (response.ok) {
            const result = await response.json();
            Alert.alert('Success', 'Client added successfully');
            navigation.navigate('TailorLandingPage');
        } else {
            const errorData = await response.json();
            Alert.alert('Error', errorData.message || 'Failed to add client');
            console.log(errorData.message)
        }
    } catch (error) {
        Alert.alert('Error', 'An error occurred while adding the client');
    } finally {
        setLoading(false);
    }
};

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        setImage(pickerResult.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image');
    }
  };

  const addMeasurementField = () => setMeasurements([...measurements, { height: '', weight: '', chestSize: '', waistSize: '', hipSize: '' }]);
  const addOrderField = () => setOrders([...orders, { item: '', status: '' }]);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-gray-50`}
    >
      <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-8 text-center`}>Add New Client</Text>
        
        {/* Image picker and preview */}
        <TouchableOpacity onPress={pickImage} style={tw`flex-row items-center justify-center border h-50 p-4 mb-6 rounded-lg shadow-md border-gray-300`}>
          <Ionicons name="camera" size={24} color="gray" />
          <Text style={tw`text-center text-lg font-semibold ml-2`}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={tw`w-full h-40 mb-6 rounded-lg`} />
        )}

        {/* Client Name */}
        <InputField 
          icon="person" 
          placeholder="Client Name" 
          value={name} 
          onChangeText={setName} 
        />

        {/* Measurements */}
        <SectionTitle title="Measurements" />
        {measurements.map((measurement, index) => (
          <MeasurementInput
            key={index}
            measurement={measurement}
            onUpdate={(updatedMeasurement) => {
              const updatedMeasurements = [...measurements];
              updatedMeasurements[index] = updatedMeasurement;
              setMeasurements(updatedMeasurements);
            }}
          />
        ))}

        <AddButton text="Add Measurement" onPress={addMeasurementField} />

        {/* Orders */}
        <SectionTitle title="Orders" />
        {orders.map((order, index) => (
          <OrderInput
            key={index}
            order={order}
            onUpdate={(updatedOrder) => {
              const updatedOrders = [...orders];
              updatedOrders[index] = updatedOrder;
              setOrders(updatedOrders);
            }}
          />
        ))}

        <AddButton text="Add Order" onPress={addOrderField} />

        {/* Submit Button */}
        <TouchableOpacity onPress={addClient} style={tw`mt-8 bg-green-500 p-4 rounded-lg shadow-md flex-row justify-center items-center`}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text style={tw`text-white text-lg ml-2`}>Add Client</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputField = ({ icon, placeholder, value, onChangeText }) => (
  <View style={tw`flex-row items-center bg-white p-4 mb-6 rounded-lg shadow-md border border-gray-200`}>
    <Ionicons name={icon} size={24} color="gray" />
    <TextInput
      style={tw`flex-1 ml-2 text-lg`}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const SectionTitle = ({ title }) => (
  <Text style={tw`text-xl font-semibold text-gray-700 mb-4`}>{title}</Text>
);

const AddButton = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress} style={tw`bg-blue-500 p-4 mb-6 rounded-lg shadow-md flex-row justify-center items-center`}>
    <Ionicons name="add" size={20} color="white" />
    <Text style={tw`text-white text-lg ml-2`}>{text}</Text>
  </TouchableOpacity>
);

const MeasurementInput = ({ measurement, onUpdate }) => (
  <View style={tw`bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200`}>
    <Text style={tw`font-semibold text-gray-600 mb-2`}>Measurement</Text>
    {['height', 'weight', 'chestSize', 'waistSize', 'hipSize'].map((field, i) => (
      <View key={i} style={tw`flex-row items-center mb-2`}>
        <Ionicons name={getIconForField(field)} size={20} color="gray" />
        <TextInput
          style={tw`flex-1 ml-2 text-lg`}
          placeholder={capitalizeFirstLetter(field)}
          value={measurement[field]}
          onChangeText={(text) => onUpdate({ ...measurement, [field]: text })}
        />
      </View>
    ))}
  </View>
);

const OrderInput = ({ order, onUpdate }) => (
  <View style={tw`bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200`}>
    <Text style={tw`font-semibold text-gray-600 mb-2`}>Order</Text>
    {['item', 'status'].map((field, i) => (
      <View key={i} style={tw`flex-row items-center mb-2`}>
        <Ionicons name={getIconForField(field)} size={20} color="gray" />
        <TextInput
          style={tw`flex-1 ml-2 text-lg`}
          placeholder={capitalizeFirstLetter(field)}
          value={order[field]}
          onChangeText={(text) => onUpdate({ ...order, [field]: text })}
        />
      </View>
    ))}
  </View>
);

const getIconForField = (field) => {
  switch (field) {
    case 'height': return 'resize';
    case 'weight': return 'barbell';
    case 'chestSize': return 'body';
    case 'waistSize': return 'body-outline';
    case 'hipSize': return 'body-sharp';
    case 'item': return 'cart';
    case 'status': return 'checkmark-done-outline';
    default: return 'information-circle-outline';
  }
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default AddClientScreen;
