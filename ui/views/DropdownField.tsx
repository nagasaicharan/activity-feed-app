import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import tw from '../tw';

interface Option {
    label: string;
    value: string | number;
}

interface DropdownFieldProps {
    name: string;
    label?: string;
    options: Option[];
    placeholder?: string;
    style?: {
        container?: StyleProp<ViewStyle>;
        label?: StyleProp<TextStyle>;
        field?: StyleProp<ViewStyle>;
    };
}

export const DropdownField = ({ name, label, options, placeholder = 'Select an option', style }: DropdownFieldProps) => {
    const { control } = useFormContext();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedOption = options.find(opt => opt.value === value);

                return (
                    <View style={[tw`mb-4`, style?.container]}>
                        {label && (
                            <Text style={[tw`mb-1 text-gray-700 font-medium`, style?.label]}>
                                {label}
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={[
                                tw`bg-white border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`,
                                error && tw`border-red-500`,
                                style?.field
                            ]}
                        >
                            <Text style={selectedOption ? tw`text-gray-900` : tw`text-gray-400`}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </Text>
                            <Text style={tw`text-gray-500`}>▼</Text>
                        </TouchableOpacity>

                        {error && (
                            <Text style={tw`text-red-500 text-sm mt-1`}>{error.message}</Text>
                        )}

                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <TouchableOpacity
                                style={tw`flex-1 bg-black/50 justify-center items-center p-4`}
                                onPress={() => setModalVisible(false)}
                            >
                                <View style={tw`bg-white rounded-xl w-full max-h-1/2`}>
                                    <FlatList
                                        data={options}
                                        keyExtractor={(item) => String(item.value)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={tw`p-4 border-b border-gray-100 bg-white first:rounded-t-xl last:border-b-0 last:rounded-b-xl`}
                                                onPress={() => {
                                                    onChange(item.value);
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <Text style={[
                                                    tw`text-base text-gray-900`,
                                                    value === item.value && tw`font-bold text-blue-600`
                                                ]}>
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                );
            }}
        />
    );
};
