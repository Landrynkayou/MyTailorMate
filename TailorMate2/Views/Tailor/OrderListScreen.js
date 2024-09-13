import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to classify orders by date
const classifyOrdersByDate = (orders) => {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const oneWeekAgo = new Date(today - 7 * oneDay);

  return {
    today: orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }),
    thisWeek: orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate > oneWeekAgo && orderDate.toDateString() !== today.toDateString();
    }),
    earlier: orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate <= oneWeekAgo;
    }),
  };
};

const OrderListScreen = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Fetch clients with their orders from the backend
  useEffect(() => {
    const fetchClientsWithOrders = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) {
          Alert.alert('Error', 'Token not found. Please log in again.');
          return;
        }

        setToken(storedToken);

        // Make the API call to fetch clients with orders
        const response = await fetch('http://192.168.1.190:5000/api/clients', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }

        const data = await response.json();
        setClients(data); // Data is an array of clients, each containing their orders
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsWithOrders();
  }, []);

  // Toggle order status
  const toggleOrderStatus = async (clientId, orderId) => {
    try {
      const client = clients.find((client) => client._id === clientId);
      if (!client) {
        Alert.alert('Error', 'Client not found');
        return;
      }

      const orderToUpdate = client.orders.find((order) => order._id === orderId);
      if (!orderToUpdate) {
        Alert.alert('Error', 'Order not found');
        return;
      }

      const newStatus = orderToUpdate.status === 'Completed' ? 'Pending' : 'Completed';

      // Make the API call to update the order status
      const response = await fetch(`http://192.168.1.190:5000/api/clients/${clientId}/orders/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the status locally
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId
            ? {
                ...client,
                orders: client.orders.map((order) =>
                  order._id === orderId ? { ...order, status: newStatus } : order
                ),
              }
            : client
        )
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  // Filter orders based on search text and selected status
  const filteredClients = clients.map((client) => ({
    ...client,
    orders: client.orders
      .filter((order) =>
        selectedStatus === 'all' ? true : order?.status?.toLowerCase() === selectedStatus
      )
      .filter((order) => order?.items?.toLowerCase().includes(searchText.toLowerCase())),
  }));

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-white p-4 shadow-md`}>
        <View style={tw`flex-row items-center`}>
          <Feather name="search" size={20} color="#888" style={tw`mr-2`} />
          <TextInput
            style={tw`bg-gray-200 rounded-lg px-3 py-2 text-gray-800 text-base flex-1`}
            placeholder="Search orders"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={tw`flex-row mt-3 justify-evenly`}>
          {['all', 'completed', 'pending'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                tw`px-3 py-2 rounded-full`,
                selectedStatus === status ? tw`bg-blue-500` : tw`bg-gray-200`,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  tw`text-base`,
                  selectedStatus === status ? tw`text-white` : tw`text-gray-800`,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(client) => client._id}
        renderItem={({ item: client }) => {
          const { today, thisWeek, earlier } = classifyOrdersByDate(client.orders);

          return (
            <View style={tw`p-3`}>
              <Text style={tw`text-lg font-semibold`}>{client.name}</Text>

              {/* Today’s Orders */}
              {today.length > 0 && (
                <View style={tw`mt-4`}>
                  <Text style={tw`text-base font-bold text-gray-700`}>Today</Text>
                  {today.map((order) => (
                    <OrderItem
                      key={order._id}
                      client={client}
                      order={order}
                      toggleOrderStatus={toggleOrderStatus}
                    />
                  ))}
                </View>
              )}

              {/* This Week’s Orders */}
              {thisWeek.length > 0 && (
                <View style={tw`mt-4`}>
                  <Text style={tw`text-base font-bold text-gray-700`}>This Week</Text>
                  {thisWeek.map((order) => (
                    <OrderItem
                      key={order._id}
                      client={client}
                      order={order}
                      toggleOrderStatus={toggleOrderStatus}
                    />
                  ))}
                </View>
              )}

              {/* Earlier Orders */}
              {earlier.length > 0 && (
                <View style={tw`mt-4`}>
                  <Text style={tw`text-base font-bold text-gray-700`}>Earlier</Text>
                  {earlier.map((order) => (
                    <OrderItem
                      key={order._id}
                      client={client}
                      order={order}
                      toggleOrderStatus={toggleOrderStatus}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
      />
    </View>
  );
};

// Component for rendering each order item
const OrderItem = ({ client, order, toggleOrderStatus }) => (
  <View
    style={[
      tw`bg-white rounded-lg p-4 my-2 mx-3 shadow-md flex-row items-center`,
      order.status.toLowerCase() === 'completed'
        ? tw`border-l-4 border-green-500`
        : tw`border-l-4 border-yellow-500`,
    ]}
  >
    <TouchableOpacity onPress={() => toggleOrderStatus(client._id, order._id)}>
      <Feather
        name={order.status === 'Completed' ? 'check-square' : 'square'}
        size={24}
        color={order.status === 'Completed' ? 'green' : 'gray'}
        style={tw`mr-3`}
      />
    </TouchableOpacity>
    <View style={tw`flex-1`}>
      <Text style={tw`text-lg font-semibold text-gray-800`}>{order.items}</Text>
      <Text style={tw`text-sm text-gray-600 mt-1`}>
        {new Date(order.createdAt).toLocaleDateString()}
      </Text>
    </View>
    <Text style={tw`text-sm text-gray-500`}>{order.status}</Text>
  </View>
);

export default OrderListScreen;
