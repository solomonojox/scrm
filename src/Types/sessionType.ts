export interface Session{
    id: string;
    sessionId: string;  
    sessionName: string;
    schoolId: string;
    startDate: string;
    endDate: string;
    classrooms: []
    sessionKey?: string;    
}