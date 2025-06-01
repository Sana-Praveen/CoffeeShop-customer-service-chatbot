import { Text,  View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';

const SearchArea = () => {


  return (
    <View className="w-full items-center bg-[#222222] pb-6">
      <View className='flex w-[90%] pt-8'>
        <Text className="text-[#A2A2A2] text-sm font-[Sora-Regular] mt-4">
          location
        </Text>
        <Text className="text-white font-[Sora-Regular] mt-2">
          Dehradun, India
        </Text>
        <View className='w-full mt-5 flex-row justify-between'>

          <View className='flex-row items-center w-[80%] h-14 px-4 bg-[#2A2A2A] rounded-2xl focus:border-secondary justify-centre'>

          <AntDesign name="search1" size={24} color="white" />
          </View>
          <TouchableOpacity
          className='flex w-14 h-14 bg-[#C67C4E] rounded-2xl items-center justify-center'>
          <Entypo name="sound-mix" size={24} color="white" />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default SearchArea;



