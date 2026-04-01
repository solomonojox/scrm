import type {
  Student, UpcomingExam, Exam, ExamResult,
  SubjectPerf, ProgressEntry, Question, Notification, Practice,
} from "../Types/Cbt/student/index";

export const student: Student = {
  name: "Amara Okafor",
  id: "STU-2024-0391",
  avatar: "AO",
  dept: "Computer Science",
  level: "300L",
};

export const upcomingExams: UpcomingExam[] = [
  { id: 1, subject: "Data Structures & Algorithms", date: "Mar 27, 2026", time: "10:00 AM", duration: 90, questions: 60, code: "CSC301" },
  { id: 2, subject: "Operating Systems", date: "Apr 2, 2026", time: "2:00 PM", duration: 60, questions: 40, code: "CSC302" },
  { id: 3, subject: "Database Management", date: "Apr 8, 2026", time: "9:00 AM", duration: 75, questions: 50, code: "CSC303" },
];

export const availableExams: Exam[] = [
  { id: 1, subject: "Data Structures & Algorithms", code: "CSC301", duration: 90, questions: 60, difficulty: "Hard", status: "available" },
  { id: 2, subject: "Discrete Mathematics", code: "MTH201", duration: 60, questions: 40, difficulty: "Medium", status: "available" },
  { id: 3, subject: "Computer Networks", code: "CSC305", duration: 75, questions: 50, difficulty: "Medium", status: "available" },
  { id: 4, subject: "Software Engineering", code: "CSC308", duration: 90, questions: 60, difficulty: "Easy", status: "locked" },
  { id: 5, subject: "Digital Logic", code: "CSC201", duration: 45, questions: 30, difficulty: "Easy", status: "available" },
];

export const examHistory: ExamResult[] = [
  { id: 1, subject: "Calculus I", code: "MTH101", date: "Mar 10, 2026", score: 87, total: 100, grade: "A", time: "72 min", status: "passed" },
  { id: 2, subject: "Physics for Engineers", code: "PHY101", date: "Mar 5, 2026", score: 63, total: 100, grade: "C", time: "85 min", status: "passed" },
  { id: 3, subject: "Introduction to Programming", code: "CSC101", date: "Feb 28, 2026", score: 94, total: 100, grade: "A+", time: "55 min", status: "passed" },
  { id: 4, subject: "Technical Writing", code: "GST202", date: "Feb 20, 2026", score: 45, total: 100, grade: "F", time: "90 min", status: "failed" },
  { id: 5, subject: "Linear Algebra", code: "MTH201", date: "Feb 12, 2026", score: 78, total: 100, grade: "B+", time: "68 min", status: "passed" },
];

export const subjectPerformance: SubjectPerf[] = [
  { subject: "Programming", score: 92, color: "#f97316" },
  { subject: "Mathematics", score: 74, color: "#fb923c" },
  { subject: "Physics", score: 63, color: "#fdba74" },
  { subject: "Networks", score: 81, color: "#fed7aa" },
  { subject: "Writing", score: 45, color: "#ffedd5" },
];

export const progressData: ProgressEntry[] = [
  { month: "Nov", score: 61 },
  { month: "Dec", score: 67 },
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 83 },
];

export const sampleQuestions: Question[] = [
  { id: 1, text: "Which data structure uses LIFO (Last In, First Out) principle?", options: ["Queue", "Stack", "Tree", "Graph"], answer: 1 },
  { id: 2, text: "What is the time complexity of Binary Search?", options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], answer: 2 },
  { id: 3, text: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], answer: 2 },
  { id: 4, text: "What does CPU stand for?", options: ["Central Processing Unit", "Core Processing Unit", "Central Program Utility", "Computer Processing Unit"], answer: 0 },
  { id: 5, text: "Which traversal visits root first in a binary tree?", options: ["Inorder", "Postorder", "Preorder", "Level-order"], answer: 2 },
  { id: 6, text: "What is a linked list?", options: ["A fixed array", "A dynamic data structure with nodes", "A type of tree", "A hash table"], answer: 1 },
  { id: 7, text: "Which algorithm uses divide and conquer?", options: ["Bubble Sort", "Linear Search", "Quick Sort", "DFS"], answer: 2 },
  { id: 8, text: "AVL tree is a type of:", options: ["Graph", "Self-balancing BST", "Heap", "Queue"], answer: 1 },
  { id: 9, text: "Dijkstra's algorithm finds:", options: ["Minimum spanning tree", "Shortest path", "Longest path", "All cycles"], answer: 1 },
  { id: 10, text: "Which is NOT a primitive data type?", options: ["int", "float", "Array", "char"], answer: 2 },
];

export const notifications: Notification[] = [
  { id: 1, type: "exam", title: "Exam Reminder", msg: "Data Structures exam starts in 3 days", time: "2h ago", read: false },
  { id: 2, type: "result", title: "Result Published", msg: "Your Calculus I result is now available", time: "1d ago", read: false },
  { id: 3, type: "info", title: "System Update", msg: "The CBT platform will undergo maintenance on Apr 1", time: "2d ago", read: true },
  { id: 4, type: "exam", title: "New Exam Added", msg: "Software Engineering exam has been scheduled", time: "3d ago", read: true },
  { id: 5, type: "result", title: "Result Published", msg: "Linear Algebra result is now available", time: "5d ago", read: true },
];

export const practices: Practice[] = [
  { id: 1, subject: "Data Structures", questions: 20, attempts: 5, bestScore: 85, lastAttempt: "2d ago" },
  { id: 2, subject: "Mathematics", questions: 15, attempts: 3, bestScore: 72, lastAttempt: "4d ago" },
  { id: 3, subject: "Computer Networks", questions: 25, attempts: 2, bestScore: 68, lastAttempt: "1w ago" },
  { id: 4, subject: "Physics", questions: 20, attempts: 1, bestScore: 55, lastAttempt: "2w ago" },
];