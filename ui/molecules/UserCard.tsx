import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Building2, Package } from 'lucide-react-native';
import tw from '../tw';

interface UserCardProps {
    name: string;
    department: string;
    section: string;
    onPress?: () => void;
}

/**
 * UserCard Component
 * Displays user profile information in a card format
 * Matches the visual design of ActivityFeedApp components
 */
export const UserCard: React.FC<UserCardProps> = ({
    name,
    department,
    section,
    onPress,
}) => {
    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            accessibilityRole={onPress ? 'button' : undefined}
            accessibilityLabel={onPress ? `View ${name}'s profile` : undefined}
            style={tw`bg-white rounded-2xl shadow-sm border border-gray-200 mb-3`}
        >
            {/* Header */}
            <View style={tw`p-5 border-b border-gray-100 flex-row items-center justify-between`}>
                <View style={tw`flex-1 mr-3`}>
                    <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>{name}</Text>
                </View>
                <View style={tw`bg-primary-50 w-12 h-12 rounded-xl items-center justify-center`}>
                    <User size={24} color={tw.color('primary')} />
                </View>
            </View>

            {/* Details */}
            <View style={tw`p-5`}>
                {/* Department */}
                <View style={tw`flex-row items-center mb-3`}>
                    <View style={tw`bg-primary-100 w-8 h-8 rounded-full items-center justify-center mr-2.5`}>
                        <Building2 size={14} color={tw.color('primary')} />
                    </View>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-xs text-gray-500`}>Department</Text>
                        <Text style={tw`text-sm font-semibold text-gray-900`}>{department}</Text>
                    </View>
                </View>

                {/* Section */}
                <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-primary-100 w-8 h-8 rounded-full items-center justify-center mr-2.5`}>
                        <Package size={14} color={tw.color('primary')} />
                    </View>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-xs text-gray-500`}>Section</Text>
                        <Text style={tw`text-sm font-semibold text-gray-900`}>{section}</Text>
                    </View>
                </View>
            </View>
        </CardWrapper>
    );
};
