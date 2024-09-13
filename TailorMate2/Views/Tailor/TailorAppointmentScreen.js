import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { FontAwesome5 } from '@expo/vector-icons'; // Import icons

const TailorAppointmentScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const BASE_URL = process.env.REACT_NATIVE_API_URL || 'http://192.168.1.190:5000';

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUserId && storedToken) {
          setUserId(storedUserId);
          setToken(storedToken);
        } else {
          console.log('No userId or token found in AsyncStorage');
          Alert.alert('Error', 'User ID or Token is missing');
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        console.error('Failed to retrieve userId or token from AsyncStorage', error);
        Alert.alert('Error', 'Failed to retrieve user data');
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchAppointments(userId, token);
    }
  }, [userId, token]);

  const fetchAppointments = async (userId, token) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/appointments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      console.log(userId)
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments', error);
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateAppointment = async (id) => {
    console.log('Validating appointment with ID:', id);
    
    // Optimistic update
    const updatedAppointments = appointments.map((appointment) =>
      appointment._id === id ? { ...appointment, validated: true, status: 'confirmed' } : appointment
    );
    setAppointments(updatedAppointments);

    try {
      const response = await fetch(`${BASE_URL}/api/appointments/${id}/validate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to validate appointment');
      }

      fetchAppointments(userId, token);
      Alert.alert('Success', 'Appointment validated successfully');
      setModalVisible(false); // Close modal on success
    } catch (error) {
      console.error('Error validating appointment', error);
      Alert.alert('Error', 'Could not validate appointment');

      const revertedAppointments = appointments.map((appointment) =>
        appointment._id === id ? { ...appointment, validated: false, status: 'pending' } : appointment
      );
      setAppointments(revertedAppointments);
    }
  };

  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg border border-gray-300 flex-row items-center`}
      onPress={() => {
        setSelectedAppointment(item);
        setModalVisible(true);
      }}
    >
      <FontAwesome5 name={item.validated ? 'check-circle' : 'times-circle'} size={24} color={item.validated ? 'green' : 'red'} style={tw`mr-4`} />
      <View style={tw`flex-1`}>
        <Text style={tw`font-semibold text-lg text-gray-800`}>{item.clientName}</Text> {/* Display client name */}
        <Text style={tw`text-gray-600`}>{item.date}</Text>
        <Text style={tw`text-gray-600`}>{item.details}</Text>
        <Text style={tw`mt-2 ${item.validated ? 'text-green-500' : 'text-red-500'}`}>
          {item.validated ? 'Validated' : 'Not Validated'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointment}
          contentContainerStyle={tw`p-4`}
          ListEmptyComponent={<Text style={tw`text-center text-gray-600 mt-5`}>No appointments found</Text>}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedAppointment && (
              <>
                <Text style={tw`text-lg font-semibold mb-2`}>Appointment Details</Text>
                <Text style={tw`text-base mb-2`}>Client: {selectedAppointment.clientName}</Text> {/* Display client name */}
                <Text style={tw`text-base mb-2`}>Date: {selectedAppointment.date}</Text>
                <Text style={tw`text-base mb-2`}>Details: {selectedAppointment.details}</Text>
                <Text style={tw`text-base mb-4 ${selectedAppointment.validated ? 'text-green-500' : 'text-red-500'}`}>
                  Status: {selectedAppointment.validated ? 'Validated' : 'Not Validated'}
                </Text>
                {!selectedAppointment.validated && (
                  <TouchableOpacity
                    style={tw`bg-blue-600 p-3 rounded-lg`}
                    onPress={() => handleValidateAppointment(selectedAppointment._id)}
                  >
                    <Text style={tw`text-white text-center`}>Validate Appointment</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={tw`bg-gray-300 p-3 rounded-lg mt-3`}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={tw`text-black text-center`}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
});

export default TailorAppointmentScreen;
