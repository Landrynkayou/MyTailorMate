import React, { useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';

// Sample data for clients
const clients = [
  { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Michael Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const ChatScreen = ({ navigation }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I have some questions about my order.', sender: 'client' },
    { id: '2', text: 'Sure! How can I help you?', sender: 'tailor' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { id: Date.now().toString(), text: newMessage, sender: 'client' }];
      setMessages(updatedMessages);
      setNewMessage('');
      
      // Scroll to the bottom when a new message is sent
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderClient = ({ item }) => (
    <TouchableOpacity
      style={tw`flex-row items-center p-4 border-b border-gray-300`}
      onPress={() => setSelectedClient(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={tw`text-lg ml-4`}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'client' ? styles.clientBubble : styles.tailorBubble]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-blue-600 py-4 px-5 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold text-center flex-1`}>
          {selectedClient ? `Chat with ${selectedClient.name}` : 'Select a Client'}
        </Text>
      </View>

      <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {selectedClient ? (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={tw`flex-grow justify-end p-4`}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <FontAwesome name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => item.id}
            renderItem={renderClient}
            contentContainerStyle={tw`p-4`}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  clientBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  tailorBubble: {
    backgroundColor: '#ECE5DD',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
  },
});

export default ChatScreen;
