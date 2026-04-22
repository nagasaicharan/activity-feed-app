import React from 'react';
import { TextInput, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import tw from '../tw';

interface TextFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    style?: {
        container?: StyleProp<ViewStyle>;
        label?: StyleProp<TextStyle>;
        field?: StyleProp<TextStyle>;
    };
}

export const TextField = ({ name, label, placeholder, secureTextEntry, multiline, numberOfLines, style }: TextFieldProps) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={[tw`mb-4`, style?.container]}>
                    {label && (
                        <Text style={[tw`mb-1 text-gray-700 font-medium`, style?.label]}>
                            {label}
                        </Text>
                    )}
                    <TextInput
                        style={[
                            tw`bg-white border border-gray-300 rounded-lg p-3 text-base`,
                            error && tw`border-red-500`,
                            multiline && tw`pt-3`,
                            style?.field
                        ]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor="#9CA3AF"
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        textAlignVertical={multiline ? 'top' : 'center'}
                    />
                    {error && (
                        <Text style={tw`text-red-500 text-sm mt-1`}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
};
