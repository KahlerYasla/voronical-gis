import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// components
import MapInputField from '@/components/home/map/MapInputField';

const Login = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login</Text>
            <MapInputField label='Username' otherStyles={styles.input} />
            <MapInputField label='Password' otherStyles={styles.input} />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Register with these credentials</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        width: '80%',
        height: 45,
        backgroundColor: 'white',
        opacity: 0.9,
        marginVertical: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: "bold"
    },
});

export default Login;
