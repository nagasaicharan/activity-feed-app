import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Primary as PrimaryButton } from '../Primary';
import { Secondary as SecondaryButton } from '../Secondary';

describe('Buttons', () => {
    describe('PrimaryButton', () => {
        it('should render children and handle press', () => {
            const onPress = jest.fn();
            // Props: title, onPress
            const { getByText } = render(
                <PrimaryButton title="Primary Action" onPress={onPress} />
            );

            const buttonText = getByText('Primary Action');
            expect(buttonText).toBeTruthy();

            fireEvent.press(buttonText);
            expect(onPress).toHaveBeenCalledTimes(1);
        });
    });

    describe('SecondaryButton', () => {
        it('should render children and handle press', () => {
            const onPress = jest.fn();
            const { getByText } = render(
                <SecondaryButton title="Secondary Action" onPress={onPress} />
            );

            const buttonText = getByText('Secondary Action');
            expect(buttonText).toBeTruthy();

            fireEvent.press(buttonText);
            expect(onPress).toHaveBeenCalledTimes(1);
        });
    });
});
