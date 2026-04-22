import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import tw from '../tw';

interface Option {
    label: string;
    value: string | number;
}

interface RadioFieldsProps {
    name: string;
    label?: string;
    options: Option[];
    style?: {
        container?: StyleProp<ViewStyle>;
        label?: StyleProp<TextStyle>;
        field?: StyleProp<ViewStyle>;
    };
}

export const RadioFields = ({ name, label, options, style }: RadioFieldsProps) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={[tw`mb-4`, style?.container]}>
                    {label && (
                        <Text style={[tw`mb-2 text-gray-700 font-medium`, style?.label]}>
                            {label}
                        </Text>
                    )}

                    <View style={[tw`flex-row flex-wrap gap-2`, style?.field]}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={String(option.value)}
                                onPress={() => onChange(option.value)}
                                style={[
                                    tw`flex-row items-center mr-4 mb-2`,
                                ]}
                            >
                                <View style={[
                                    tw`w-5 h-5 rounded-full border items-center justify-center mr-2`,
                                    value === option.value ? tw`border-blue-600` : tw`border-gray-400`
                                ]}>
                                    {value === option.value && (
                                        <View style={tw`w-2.5 h-2.5 rounded-full bg-blue-600`} />
                                    )}
                                </View>
                                <Text style={tw`text-gray-700`}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {error && (
                        <Text style={tw`text-red-500 text-sm mt-1`}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
};
