import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONT } from '../../constants/Theme';

type FontWeight = 'regular' | 'bold' | 'italic' | 'boldItalic';

interface CustomTextProps extends TextProps {
    children: React.ReactNode;
    boldness?: FontWeight;
}

const CustomText: React.FC<CustomTextProps> = ({ children, boldness = 'regular', style, ...rest }) => {
    const boldnessStyle = getFontWeight(boldness);

    return (
        <Text style={[boldnessStyle, style]} {...rest}>
            {children}
        </Text>
    );
};

const getFontWeight = (boldness: FontWeight) => {
    switch (boldness) {
        case 'bold':
            return { fontFamily: FONT.bold };
        case 'italic':
            return { fontFamily: FONT.italic };
        case 'boldItalic':
            return { fontFamily: FONT.boldItalic };
        default:
            return { fontFamily: FONT.regular };
    }
};

export default CustomText;
