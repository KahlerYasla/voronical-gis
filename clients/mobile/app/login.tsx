import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';

// stores
import { useAuthStore } from '@/stores/AuthStore';

// components
import MapInputField from '@/components/home/map/MapInputField';
import { useState } from 'react';

const Login = () => {
    // states
    const [isChecked, setIsChecked] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // stores
    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);

    const route = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login</Text>
            <MapInputField
                label='Username'
                onChangeText={setUsername}
                otherStyles={styles.input}
            />
            <MapInputField
                label='Password'
                onChangeText={setPassword}
                otherStyles={styles.input}
            />
            <View style={styles.checkboxContainer}>
                <Switch
                    value={isChecked}
                    onValueChange={setIsChecked}
                    trackColor={{ false: 'grey', true: 'white' }}
                    thumbColor={isChecked ? 'black' : 'grey'}
                />
                <Text style={styles.checkboxLabel}>Marketer account</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (username === '' || password === '') {
                        alert('Please fill all fields');
                        return;
                    }
                    login(username, password, isChecked ? 'marketer' : 'user').then(success => {
                        if (success) {
                            alert('Logged in successfully');
                            // redirect to home page
                            route.navigate('/home');
                        }
                        else {
                            alert('Invalid credentials');
                        }
                    });
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    if (username === '' || password === '') {
                        alert('Please fill all fields');
                        return;
                    }
                    register(username, password, isChecked ? 'marketer' : 'user').then(success => {
                        if (success) {
                            alert('Registered successfully');
                            // redirect to login page
                            route.navigate('/login');
                        }
                        else {
                            alert('Failed to register');
                        }
                    });
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Register with these credentials</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
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
    checkboxContainer: {
        padding: 10,
        marginLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginVertical: 20,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: 'white',
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
