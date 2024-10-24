import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Alert, ScrollView } from 'react-native';
import { firestore, collection, setDoc, doc, getDocs, deleteDoc } from '../firebase/Config';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

function HomeScreen({ navigation }) {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchShoppingLists = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'ostoslistat'));
                const lists = querySnapshot.docs.map(doc => doc.id);
                setShoppingLists(lists);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };

        fetchShoppingLists();
    }, []);

    const save = async (document_name) => {
        try {
            const docRef = doc(firestore, 'ostoslistat', document_name);
            await setDoc(docRef, {});
            setShoppingLists(prev => [...prev, document_name]);
            console.log('Uusi dokumentti luotu:', document_name);
            setName("");
        } catch (error) {
            console.log('Virhe luodessa dokumenttia:', error);
            setName("");
        }
    };

    const handleDelete = (document_name) => {
        // Näytä varmistusdialogi ennen poistamista
        Alert.alert(
            'Varmistus',
            'Haluatko varmasti poistaa tämän ostoslistan?',
            [
                {
                    text: 'Peruuta',
                    onPress: () => console.log('Poisto peruutettu'),
                    style: 'cancel',
                },
                {
                    text: 'Poista',
                    onPress: async () => {
                        try {
                            // Poista ostoslista Firestoresta
                            const docRef = doc(firestore, 'ostoslistat', document_name);
                            await deleteDoc(docRef);

                            // Päivitä tila
                            setShoppingLists(prev => prev.filter(item => item !== document_name));
                            console.log('Ostoslista poistettu:', document_name);
                        } catch (error) {
                            console.error('Virhe poistettaessa ostoslistaa:', error);
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ImageBackground source={require('../pics/ruokaostokset.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Nimi ostoslistalle"
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.textInput}
                />
                <Button title="lisää uusi ostoslista" onPress={() => save(name)} style={styles.lisaaNappi} />
                <ScrollView>
                    {shoppingLists.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate('Ostoslista', { ostoslistan_nimi: item })}
                            style={styles.ostoslistat}
                        >
                            <Text>{item}</Text>
                            <TouchableOpacity onPress={() => handleDelete(item)}>
                                <Icon name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </TouchableOpacity>

                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',  // Aseta tausta läpinäkyväksi
        alignItems: 'center',
        justifyContent: "flex-start",
        padding: 8,
    },
    ostoslistat: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 8,
        padding: 8,
        width: "100%",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    lisaaNappi: {
        marginBottom: 32
    },
    textInput: {
        borderColor: '#000',
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        width: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});
