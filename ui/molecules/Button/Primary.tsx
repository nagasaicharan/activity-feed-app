import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from '../../tw';
import { Text } from '../../atoms';

interface PrimaryButtonProps {
    title: string;
    onPress: () => Promise<void> | void;
    style?: any;
    textStyle?: any;
    disabled?: boolean;
}

export const Primary = ({ title, onPress, style, textStyle, disabled = false }: PrimaryButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        if (loading || disabled) return;
        setLoading(true);
        try {
            await onPress();
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || disabled;

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                tw`bg-primary-800 px-4 py-3 rounded-lg flex-row justify-center items-center`,
                style,
                isDisabled && tw`opacity-50`
            ]}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
        >
            {loading ? (
                <ActivityIndicator color="white" style={tw`mr-2`} />
            ) : null}
            <Text style={[tw`text-white font-bold text-base text-center`, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};
