import api from './index';

const API_URL = import.meta.env.VITE_API_URL;// 'https://event-management-frontend-5e7ap9o9a.vercel.app';//'http://localhost:3000';

export interface Event {
  id: string;
  title: string;
  address: string;
  googleMapsUrl: string;
  qrCodeUrl: string;
  shortUrl: string;
  numberOfDays: number,
  startDate: string,
  endDate: string,
  tickets?: Ticket[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  attended: boolean;
  attendanceTimestamp: string;
  qrCodeUrl: string;
  attendanceUrl: string;
  event: Event;
}

export const fetchEvents = async (): Promise<Event[]> => {
  const response = await api.get(`${API_URL}/api/events`);
  return response.data.data;
};

export const fetchEventDetails = async (id: string): Promise<Event> => {
  const response = await api.get(`${API_URL}/api/events/${id}`);
  return response.data;
};

export const getTicketDetails = async (eventId: string, ticketId: string): Promise<Ticket> => {
  const response = await api.get(`${API_URL}/api/events/${eventId}/tickets/${ticketId}`);
  return response.data;
};

export const getTicketDetailsByTicketId = async (ticketId: string): Promise<Ticket> => {
  const response = await api.get(`${API_URL}/api/events/tickets/${ticketId}`);
  return response.data;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const response = await api.post(`${API_URL}/api/events`, eventData);
  return response.data;
};

export const createTicket = async (eventId: string): Promise<Ticket> => {
  const response = await api.post(`${API_URL}/api/events/${eventId}/tickets`);
  return response.data;
};

export const markAttendance = async (ticketId: string): Promise<Ticket> => {
  const response = await api.put(`${API_URL}/api/events/tickets/${ticketId}/attendance`);
  return response.data;
};

// export const markAttendance = async (ticketId: string): Promise<Ticket> => {
//   const response = await axios.put(`${API_URL}/api/tickets/${ticketId}/attendance`);
//   return response.data;
// };