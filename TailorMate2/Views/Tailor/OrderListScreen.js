import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([
    { id: '1', item: 'Kurta', status: 'Completed', date: '2023-05-15' },
    { id: '2', item: 'Salwar', status: 'Upcoming', date: '2023-06-01' },
    { id: '3', item: 'Blouse', status: 'Completed', date: '2023-04-20' },
    { id: '4', item: 'Burka', status: 'Upcoming', date: '2023-07-01' },
  ]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const toggleOrderStatus = (id) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id
          ? { ...order, status: order.status === 'Completed' ? 'Upcoming' : 'Completed' }
          : order
      )
    );
  };

  const filteredOrders = orders
    .filter((order) => (selectedStatus === 'all' ? true : order.status.toLowerCase() === selectedStatus))
    .filter((order) => order.item.toLowerCase().includes(searchText.toLowerCase()));

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
          {['all', 'completed', 'upcoming'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                tw`px-3 py-2 rounded-full`,
                selectedStatus === status ? tw`bg-blue-500` : tw`bg-gray-200`
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                tw`text-base`,
                selectedStatus === status ? tw`text-white` : tw`text-gray-800`
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            tw`bg-white rounded-lg p-4 my-2 mx-3 shadow-md flex-row items-center`,
            item.status.toLowerCase() === 'completed' ? tw`border-l-4 border-green-500` : 
            item.status.toLowerCase() === 'upcoming' ? tw`border-l-4 border-blue-500` : null
          ]}>
            <TouchableOpacity onPress={() => toggleOrderStatus(item.id)}>
              <Feather 
                name={item.status === 'Completed' ? 'check-square' : 'square'} 
                size={24} 
                color={item.status === 'Completed' ? 'green' : 'gray'}
                style={tw`mr-3`}
              />
            </TouchableOpacity>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-semibold text-gray-800`}>{item.item}</Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>{item.date}</Text>
            </View>
            <Text style={tw`text-sm text-gray-500`}>{item.status}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
      />
    </View>
  );
};

export default OrderListScreen;
