export interface event {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventVenue: string;
  eventDate: string;      // e.g. "10/15/2025 12:00:00 AM"
  eventTime: string;      // e.g. "12:00"
  eventType: string;
  eventCreatedAt: string; // ISO datetime
  eventUpdatedAt: string; // ISO datetime or "0001-01-01T00:00:00"
}
