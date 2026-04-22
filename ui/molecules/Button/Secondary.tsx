import React from 'react';
import { TouchableOpacity } from 'react-native';
import tw from '../../tw';
import { Text } from '../../atoms';

interface SecondaryButtonProps {
    title: string;
    onPress: () => void;
    style?: any;
    textStyle?: any;
    disabled?: boolean;
}

export const Secondary = ({ title, onPress, style, textStyle, disabled = false }: SecondaryButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                tw`bg-gray-200 px-4 py-3 rounded-lg flex-row justify-center items-center`,
                style,
                disabled && tw`opacity-50`
            ]}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            <Text style={[tw`text-gray-800 font-bold text-base text-center`, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};
