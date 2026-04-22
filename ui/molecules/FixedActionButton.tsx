import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '../tw';

interface FixedActionButtonProps {
    title: string;
    onPress: () => void;
    icon?: React.ComponentType<{ size: number; color: string }>;
    disabled?: boolean;
    loading?: boolean;
}

const BUTTON_TOUCH_STYLE = {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 12,
};

/**
 * FixedActionButton Component
 * A fixed-position button at the bottom of the screen with safe area support
 * Minimum 44pt touch target for accessibility
 * Uses Nutrien primary green color
 */
export const FixedActionButton: React.FC<FixedActionButtonProps> = ({
    title,
    onPress,
    icon: Icon,
    disabled = false,
    loading = false,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                tw`absolute bottom-0 left-0 right-0 px-4 bg-white border-t border-gray-200`,
                { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={title}
                accessibilityState={{ disabled: disabled || loading }}
                style={[
                    tw`flex-row items-center justify-center rounded-xl shadow-lg`,
                    tw`${disabled || loading ? 'bg-gray-400' : 'bg-primary'}`,
                    // Ensure minimum 44pt touch target height
                    BUTTON_TOUCH_STYLE,
                ]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        {Icon && <Icon size={20} color="#fff" />}
                        <Text
                            style={[
                                tw`text-white font-semibold text-base`,
                                Icon && tw`ml-2`,
                            ]}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};
