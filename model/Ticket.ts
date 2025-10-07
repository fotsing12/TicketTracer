export default interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'created' | 'under assistance' | 'completed';
    rating: number
}