import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from '../tw';

interface HeaderProps {
    title: string;
    onBackPress?: () => void;
    showBackButton?: boolean;
    rightComponent?: React.ReactNode;
}

/**
 * CustomHeader Component
 * A reusable header with Nutrien primary green background and back button
 */
export const Header: React.FC<HeaderProps> = ({
    title,
    onBackPress,
    showBackButton = true,
    rightComponent,
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={tw.color('primary')} />
            <View
                style={[
                    tw`bg-primary w-full px-4 pr-8`,
                    { paddingTop: insets.top },
                ]}
            >
                <View style={tw`flex-row items-center justify-between py-2`}>
                    {/* Back Button */}
                    {showBackButton ? (
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={tw`w-10 h-10 items-center justify-center`}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <View style={tw`w-10 h-10`} />
                    )}

                    {/* Title */}
                    <View style={tw`flex-1 px-3`}>
                        <Text
                            style={tw`text-white text-lg font-bold text-center`}
                            numberOfLines={1}
                            accessibilityRole="header"
                        >
                            {title}
                        </Text>
                    </View>

                    {/* Right Component or Spacer */}
                    {rightComponent ? (
                        <View style={tw`w-10 h-10 items-center justify-center`}>
                            {rightComponent}
                        </View>
                    ) : (
                        <View style={tw`w-10 h-10`} />
                    )}
                </View>
            </View>
        </>
    );
};
