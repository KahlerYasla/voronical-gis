import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, TextStyle, ViewStyle } from 'react-native';

import CustomText from './CustomText';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <CustomText style={[styles.text, textStyle]} boldness="bold">
                {title}
            </CustomText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default CustomButton;
