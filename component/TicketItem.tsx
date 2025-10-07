import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import Ticket from '@/model/Ticket';
import { useState } from 'react';


type TicketItemProps = {
    Ticket: Ticket;       // expects a prop called "Ticket"
    onEdit: (ticket: Ticket) => void;
    onDelete: (ticketId: number) => void;
};



export default function TicketItem({ Ticket, onDelete, onEdit }: TicketItemProps) {

    const getStatusColor = () => {
        switch (Ticket.status.toLowerCase()) {
            case 'created':
                return '#f39c12'; // orange
            case 'completed':
                return '#27ae60'; // green
            case 'pending':
                return '#e74c3c'; // red
            default:
                return '#7f8c8d'; // gray for unknown
        }
    };

    const rateCompletedTicket = (index: number) => {
        if (Ticket.status === 'completed') {
            setNumber(index + 1)
        }
    }

    const [numberOfStars, setNumber] = useState(0)

    const num: number = numberOfStars

    return (
        <View style={styles.ticket}>
            <Text style={styles.title} >{Ticket.title}</Text>
            <Text style={styles.description} >{Ticket.description}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusText}>{Ticket.status}</Text>
            </View>
            <View style={styles.line} />
            <Text style={styles.rating} >rating</Text>
            <View style={{ flexDirection: "row" }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => rateCompletedTicket(index)}>

                        {
                            index < numberOfStars ?
                                <AntDesign
                                    name="star"
                                    size={35}
                                    color="#FFD700"
                                /> :
                                <Feather
                                    name="star"
                                    size={35}
                                    color="black"
                                />
                        }
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <AntDesign style={{ paddingEnd: 10, }} name="edit" size={24} color="black" onPress={() => onEdit(Ticket)} />
                <AntDesign name="delete" size={24} color="red" onPress={() => onDelete(Ticket.id)} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    ticket: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    line: {
        height: 1,
        backgroundColor: '#ecf0f1',
        marginVertical: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    rating: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#2c3e50',
    },
    stars: {
        flexDirection: 'row',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 16, // spacing between icons (RN >=0.71) else use margin
    },
});