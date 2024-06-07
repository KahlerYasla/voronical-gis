import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { FONT } from '@/constants/Theme';

interface MapInputField extends TextInputProps {
    label: string;
    otherStyles?: ViewStyle;
    labelStyle?: TextStyle;
    containerStyle?: ViewStyle;
    inputTextStyle?: TextStyle;
}

const MapInputField: React.FC<MapInputField> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    multiline,
    numberOfLines,
    otherStyles,
    labelStyle,
    containerStyle,
    inputTextStyle
}) => {
    return (
        <View style={[styles.container, containerStyle, otherStyles]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <TextInput
                style={[styles.input, inputTextStyle]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={styles.placeholder.color}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                autoCapitalize='none'
                autoCorrect={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        borderBottomWidth: .5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    label: {
        fontFamily: FONT.bold,
        fontSize: 15,
        marginBottom: 8,
        color: '#fff',
    },
    input: {
        fontFamily: FONT.regular,
        padding: 10,
        fontSize: 15,
        color: '#fff',
    },
    placeholder: {
        color: "rgba(255, 255, 255, 0.40)",
    },
});

export default MapInputField;
