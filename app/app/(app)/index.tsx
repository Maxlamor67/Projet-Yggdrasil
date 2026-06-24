import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const NoProject: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duration={600}
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain" 
                />
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.footerTitle}>Aucun projet ouvert</Text>
                <Text style={styles.footerDescription}>
                    Vous n&apos;avez pas encore de projet actif. Ouvrez un projet depuis
                    l&apos;application de bureau.
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/scan-qr')}
                    >
                        <LinearGradient
                            colors={['#34ea8cff', '#00C853']}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Se connecter au PC</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 300,
    },
    footer: {
        flex: 3,
        backgroundColor: '#171C22',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    footerTitle: {
        color: '#f2f2f2',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footerDescription: {
        color: 'grey',
        marginBottom: 30,
        lineHeight: 20,
    },
    actions: {
        marginTop: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default NoProject;
