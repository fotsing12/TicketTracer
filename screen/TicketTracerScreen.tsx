import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import Entypo from '@expo/vector-icons/Entypo';

import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";

import TicketItem from "@/component/TicketItem";
import Ticket from "@/model/Ticket";
import { useState } from "react";

export default function TicketTracerScreen() {

    const [tickets, setTicket] = useState<Ticket[]>([])
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<"created" | "under assistance" | "completed">("created");


    const addTicket = () => {
        if (title.trim().length > 0) {
            const lastId = tickets.length > 0 ? tickets[tickets.length - 1].id : 0;
            const newTicket: Ticket = {
                id: lastId + 1,
                title: title,
                description: description,
                status: status || "created",
                rating: 0
            };
            setTicket([...tickets, newTicket]);
            setTitle('');
            setDescription('');
            setStatus("created")

        }
        console.log(tickets);
    };

    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    const handleEditTicket = (ticket: Ticket) => {
        setEditingTicket(ticket);  // set the ticket we want to edit
        setTitle(ticket.title);
        setDescription(ticket.description);
        setStatus(ticket.status)
        setModalVisible(true);     // reuse the same modal

    };

    const handleSaveTicket = () => {
        if (editingTicket) {
            setTicket(tickets.map(t => t.id === editingTicket.id
                ? { ...t, title, description, status }
                : t
            ));
            setEditingTicket(null);
        } else {
            addTicket();
        }
        setModalVisible(false);
        setTitle('');
        setDescription('');
    };


    const renderTicket = ({ item }: { item: Ticket }) => (
        <TicketItem Ticket={item} onEdit={handleEditTicket} onDelete={(id) => setTicket(tickets.filter(t => t.id !== id))} />
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.title}>TicketTracer</Text>
            </View>
            <FlatList<Ticket>
                data={tickets}
                style={styles.list}
                contentContainerStyle={{ paddingBottom: 50 }}
                renderItem={renderTicket}
                keyExtractor={(item: Ticket) => item.id.toString()}

            />
            <TouchableOpacity style={styles.floatingActionButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>New Ticket</Text>
                <Entypo name="plus" size={24} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"  // "fade" | "slide" | "none"
                transparent={false}     // true = modal overlay with transparency
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Android back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}> Create New Ticket</Text>
                        <Text style={styles.inputTitle}> Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Text style={styles.inputTitle}> Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            value={description}
                            onChangeText={setDescription}
                        />
                        {editingTicket ?
                            <View style={styles.pickerContainer}>

                                <Text style={styles.inputTitle}>Status</Text>
                                <Picker
                                    selectedValue={status}
                                    onValueChange={(value) => setStatus(value)}
                                    dropdownIconColor="#2196F3" // optional, changes the dropdown arrow color
                                    style={styles.picker}
                                >
                                    <Picker.Item label="created" value="created" />
                                    <Picker.Item label="under assistance" value="under assistance" />
                                    <Picker.Item label="completed" value="completed" />
                                </Picker>
                            </View>
                            :
                            <View></View>
                        }
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTicket}>
                                <Text style={styles.buttonText}>{editingTicket ? 'Save' : 'Add'}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const { width } = Dimensions.get("window"); // get screen width

const styles = StyleSheet.create({
    header: {
        height: 150,
        width: width,
        backgroundColor: "pink",
        borderBottomLeftRadius: 20,   // only bottom left rounded
        borderBottomRightRadius: 20,  // only bottom right rounded
        overflow: "hidden",           // ensures child views don’t bleed outside the radius
        padding: 20,
    },
    title: {
        fontSize: 24,       // large text
        fontWeight: "bold", // bold
        color: "#000",      // black text
        marginBottom: 8,    // space below
    },
    floatingActionButton: {
        flexDirection: 'row',          // icon + text horizontally
        alignItems: 'center',          // vertical alignment
        backgroundColor: '#427bf5',    // your preferred color
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,              // smooth rounded edges
        position: 'absolute',          // float above content
        bottom: 20,                    // distance from bottom
        right: 20,                     // distance from right
        elevation: 6,                  // Android shadow
        shadowColor: '#000',           // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
    },
    fabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 50,
        width: 280,
        padding: 10,
        borderRadius: 12,             // rounded corners
        paddingHorizontal: 15,        // inner padding
        fontSize: 16,
        borderWidth: 1,
        borderColor: "black"

    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        flex: 1,                     // take equal width
        backgroundColor: '#f44336',  // red
        paddingVertical: 14,          // taller button
        borderRadius: 12,             // smooth rounded corners
        marginRight: 10,              // spacing between buttons
        alignItems: 'center',         // center text
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,                 // Android shadow
    },

    saveButton: {
        flex: 1,
        backgroundColor: '#2196F3',   // blue
        paddingVertical: 14,
        borderRadius: 12,
        marginLeft: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    modalText: {
        color: '#000000ff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    inputTitle: {
        color: '#000000ff',
        fontWeight: 'normal',
        fontSize: 16,
    },
    list: {
        flex: 1, // <-- this is crucial
        paddingHorizontal: 10
    },
    pickerContainer: {
        borderRadius: 12,
        backgroundColor: '#f0f0f0',   // light gray background
        marginVertical: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },

    picker: {
        height: 50,
        color: '#333', // text color
        fontSize: 16,
    },

})