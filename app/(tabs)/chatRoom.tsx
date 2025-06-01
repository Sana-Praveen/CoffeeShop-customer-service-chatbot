import { Alert, TouchableOpacity, View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import MessageList from '@/components/MessageList';
import { MessageInterface } from '@/types/types';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { callChatBotAPI } from '@/services/chatBot';
import PageHeader from '@/components/PageHeader';
import { useCart } from '@/components/CartContext';

// Define interface for cart items
interface CartItem {
    item: string;
    quantity: number;
}

// Define interface for memory
interface Memory {
    order?: CartItem[];
    [key: string]: any; // For any other properties in memory
}

// Define the exact response format based on the logs
interface ChatBotApiResponse {
    content: string;
    role: string;
    memory?: Memory;
}

const ChatRoom = () => {
    const { addToCart, emptyCart } = useCart();
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const textRef = useRef('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {}, [messages]);

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;

        try {
            // Add user message to the messages array
            const userMessage: MessageInterface = { content: message, role: 'user' };
            const inputMessages = [...messages, userMessage];
            setMessages(inputMessages);
            textRef.current = '';
            inputRef.current?.clear();
            setIsTyping(true);

            // Call the API
            const response = await callChatBotAPI(inputMessages);
            console.log('API Response:', response);

            // Check if response exists
            if (!response) {
                throw new Error('Chatbot API: No response received');
            }

            // Cast response to expected format
            const typedResponse = response as ChatBotApiResponse;
            
            // Check if response has proper format
            if (!typedResponse.role || typedResponse.role !== 'assistant') {
                console.warn('Unexpected response role:', typedResponse.role);
            }
            
            // Create message with default content if empty
            const botMessage: MessageInterface = {
                content: typedResponse.content || 'I did not get a response. Please try again.',
                role: 'assistant'
            };
            
            console.log('Adding bot message:', botMessage);
            setMessages(prevMessages => [...prevMessages, botMessage]);
            
            // Handle cart items if present
            if (typedResponse.memory?.order && Array.isArray(typedResponse.memory.order)) {
                console.log('Processing order:', typedResponse.memory.order);
                emptyCart();
                typedResponse.memory.order.forEach((item: CartItem) => {
                    if (item && typeof item === 'object' && item.item && item.quantity) {
                        addToCart(item.item, item.quantity);
                    }
                });
            }

        } catch (error: unknown) {
            console.error('Error in handleSendMessage:', error);
            let errorMessage = 'Failed to communicate with the chatbot. Please try again.';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Alert.alert(
                'Error Sending Message',
                errorMessage,
                [{ text: 'OK' }]
            );
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <GestureHandlerRootView>
            <StatusBar style='dark' />

            <View className='flex-1 bg-white'>
                <PageHeader title="Chat Bot" showHeaderRight={false} bgColor='white' />
                <View className='h-3 border-b border-neutral-300' />

                <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
                    <View className='flex-1'>
                        <MessageList messages={messages} isTyping={isTyping} />
                    </View>

                    <View style={{ marginBottom: hp(2.7) }} className='pt-2'>
                        <View className="flex-row mx-3 justify-between border p-2 bg-white border-neutral-300 rounded-full pl-5">
                            <TextInput
                                ref={inputRef}
                                onChangeText={value => textRef.current = value}
                                placeholder='Type message...'
                                style={{ fontSize: hp(2) }}
                                className='flex-1 mr2'
                            />
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                className='bg-neutral-200 p-2 mr-[1px] rounded-full'
                            >
                                <Feather name="send" size={hp(2.7)} color="#737373" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

export default ChatRoom;