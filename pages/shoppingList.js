import { Button, ImageBackground, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { firestore, doc, setDoc, serverTimestamp, getDoc } from '../firebase/Config';
import { useState, useEffect } from 'react';

export default function Ostoslista({ route }) {
    const { ostoslistan_nimi } = route.params;
    const [shoppingList, setShoppingList] = useState([]);
    const [tuote, setTuote] = useState('');
    const [doneItems, setDoneItems] = useState([]); // Holds the list of completed items

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(firestore, 'ostoslistat', ostoslistan_nimi);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setShoppingList(data.tuote || []);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async () => {
        try {
            const docRef = doc(firestore, 'ostoslistat', ostoslistan_nimi);
            await setDoc(docRef, {
                tuote: [...shoppingList, tuote],
                timestamp: serverTimestamp(),
            }, { merge: true });

            setShoppingList(prev => [...prev, tuote]);
            setTuote('');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleDone = (index) => {
        if (doneItems.includes(index)) {
            setDoneItems(doneItems.filter(itemIndex => itemIndex !== index)); // Remove from done items if it is already marked
        } else {
            setDoneItems([...doneItems, index]); // Add to done items
        }
    };

    // Function to handle the deletion of an item on long press
    const handleDelete = (index) => {
        // Näytä varmistusdialogi ennen poistamista
        Alert.alert(
            'Varmistus', // Otsikko
            'Oletko aivan varma, että tuote poistetaan ostoslistasta?', // Viesti
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
                            const updatedList = shoppingList.filter((_, i) => i !== index); 
    
                            const docRef = doc(firestore, 'ostoslistat', ostoslistan_nimi);
                            await setDoc(docRef, {
                                tuote: updatedList,
                                timestamp: serverTimestamp(),
                            }, { merge: true });
    
                            setShoppingList(updatedList); 
                        } catch (error) {
                            console.error('Error deleting item:', error);
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
                <Text style={styles.header}>{ostoslistan_nimi}</Text>
                <View>
                    <TextInput
                        placeholder="Lisää tuote"
                        value={tuote}
                        onChangeText={text => setTuote(text)}
                        style={styles.textInput}
                    />
                    <Button title="Lisää" onPress={handleSubmit} />
                </View>
                <ScrollView style={styles.paper}>
                    {shoppingList.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => handleDone(index)}
                            onLongPress={() => handleDelete(index)} // Long press to delete
                        >
                            <View style={styles.ostos}>
                                <Text 
                                    style={[
                                        styles.fontCaveat, 
                                        doneItems.includes(index) && { textDecorationLine: 'line-through', color: "lightgrey" }
                                    ]}
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        padding: 8,
    },
    header: {
        margin: 8,
        fontSize: 24,
        fontWeight: 'bold',
    },
    ostosPaper: {
        width: "100%",
        resizeMode: 'cover',
        justifyContent: "flex-start",
        alignItems: "center",
    },
    ostos: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: 2,
        padding: 4,
        width: "100%",
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
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
    fontCaveat: {
        fontSize: 32,
        color: "black",
    },
});
