import React, { useState } from "react";
import {
  ChevronDown,
  Calendar,
  CheckSquare,
  Clock,
  Eye,
  Filter,
  ArrowLeft,
  Download,
  Upload,
  X,
} from "lucide-react";
import AssignmentTable from "./AssignmentTable";
import AssignmentModal from "./AssignmentModal";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dateCreated: string;
  dueDate: string;
  teacherName: string;
  status: "Completed" | "Pending" | "Overdue";
  pupilName: string;
  class: string;
  submissionDate?: string;
  score?: string;
  description: string;
  questions: string[];
  resources: string[];
}

interface Student {
  id: string;
  name: string;
  assignments: Assignment[];
}

// Main Parent Component
const AssignmentDashboard: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("Joy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const recordsPerPage = 5;

  // Mock data for students and their assignments
  const students: Student[] = [
    {
      id: "joy",
      name: "Joy",
      assignments: [
        {
          id: "10001",
          subject: "Creative Arts",
          title: "Importance of arts and crafts",
          dateCreated: "22-02-2025",
          dueDate: "22-02-2025",
          teacherName: "Mabel Billy",
          status: "Completed",
          pupilName: "Joy",
          class: "Js1",
          submissionDate: "22-02-2025",
          score: "85%",
          description:
            "Create an artwork that demonstrates the importance of arts and crafts in daily life. Use mixed media techniques including painting, collage, and sculpture elements.",
          questions: [
            "Create a mixed media artwork using at least 3 different materials",
            "Write a 200-word reflection on how arts and crafts impact society",
            "Present your work to the class explaining your creative process",
            "Document your creative journey with photos of each stage",
          ],
          resources: ["Video & PDF"],
        },
        {
          id: "10002",
          subject: "Creative Arts",
          title: "Importance of arts and crafts",
          dateCreated: "22-02-2025",
          dueDate: "22-02-2025",
          teacherName: "Mabel Billy",
          status: "Pending",
          pupilName: "Joy",
          class: "Js1",
          description:
            "Create an artwork that demonstrates the importance of arts and crafts in daily life. Use mixed media techniques including painting, collage, and sculpture elements.",
          questions: [
            "Create a mixed media artwork using at least 3 different materials",
            "Write a 200-word reflection on how arts and crafts impact society",
            "Present your work to the class explaining your creative process",
            "Document your creative journey with photos of each stage",
          ],
          resources: ["Video & PDF"],
        },
        {
          id: "10003",
          subject: "Creative Arts",
          title: "Importance of arts and crafts",
          dateCreated: "22-02-2025",
          dueDate: "22-02-2025",
          teacherName: "Mabel Billy",
          status: "Overdue",
          pupilName: "Joy",
          class: "Js1",
          description:
            "Create an artwork that demonstrates the importance of arts and crafts in daily life. Use mixed media techniques including painting, collage, and sculpture elements.",
          questions: [
            "Create a mixed media artwork using at least 3 different materials",
            "Write a 200-word reflection on how arts and crafts impact society",
            "Present your work to the class explaining your creative process",
            "Document your creative journey with photos of each stage",
          ],
          resources: ["Video & PDF"],
        },
        // Add remaining assignments with complete data for Joy
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `1000${i + 4}`,
          subject: "Creative Arts",
          title: "Importance of arts and crafts",
          dateCreated: "22-02-2025",
          dueDate: "22-02-2025",
          teacherName: "Mabel Billy",
          status: ["Completed", "Pending", "Overdue", "Pending"][i] as
            | "Completed"
            | "Pending"
            | "Overdue",
          pupilName: "Joy",
          class: "Js1",
          submissionDate: i === 0 ? "22-02-2025" : undefined,
          score: i === 0 ? "90%" : undefined,
          description:
            "Create an artwork that demonstrates the importance of arts and crafts in daily life. Use mixed media techniques including painting, collage, and sculpture elements.",
          questions: [
            "Create a mixed media artwork using at least 3 different materials",
            "Write a 200-word reflection on how arts and crafts impact society",
            "Present your work to the class explaining your creative process",
            "Document your creative journey with photos of each stage",
          ],
          resources: ["Video & PDF"],
        })),
      ],
    },
    {
      id: "emma",
      name: "Emma",
      assignments: [
        {
          id: "20001",
          subject: "Mathematics",
          title: "Basic Algebra Problems",
          dateCreated: "21-02-2025",
          dueDate: "25-02-2025",
          teacherName: "John Smith",
          status: "Pending",
          pupilName: "Emma",
          class: "Js2",
          description:
            "Solve the attached worksheet covering linear equations from New General Mathematics textbook pages 34-38. Submit your answers as a PDF or written copy by the due date.",
          questions: [
            "Simplify: 3x+5x-2+3x + 5x - 2+3x+5x-2x",
            "Solve for x: 2x+7=152x + 7 = 152x+7=15",
            "Factorize: x2+5x+6x^2 + 5x + 6x²+5x+6",
            "Expand and simplify: (x+3)(x-2)(x + 3)(x - 2)(x+3)(x-2)",
            "If y=2x-1y = 2x - 1y=2x-1, find y when x = 4",
            "Solve the equation: 3x-42=5frac{3x - 4}{2} = 523x−4​=5",
          ],
          resources: ["Video & PDF"],
        },
        {
          id: "20002",
          subject: "Science",
          title: "Water Cycle Project",
          dateCreated: "20-02-2025",
          dueDate: "27-02-2025",
          teacherName: "Sarah Johnson",
          status: "Completed",
          pupilName: "Emma",
          class: "Js2",
          submissionDate: "26-02-2025",
          score: "92%",
          description:
            "Create a detailed diagram and explanation of the water cycle, including all major processes and their importance to Earth's ecosystem.",
          questions: [
            "Draw and label a complete water cycle diagram",
            "Explain each process: evaporation, condensation, precipitation, collection",
            "Describe how human activities affect the water cycle",
            "Create a mini experiment showing evaporation and condensation",
          ],
          resources: ["Video & PDF"],
        },
        {
          id: "20003",
          subject: "English",
          title: "Essay on Climate Change",
          dateCreated: "19-02-2025",
          dueDate: "24-02-2025",
          teacherName: "Mike Wilson",
          status: "Overdue",
          pupilName: "Emma",
          class: "Js2",
          description:
            "Write a comprehensive essay discussing the causes, effects, and potential solutions to climate change. Use credible sources and proper citations.",
          questions: [
            "Write a 500-word essay on climate change",
            "Include at least 3 credible sources",
            "Discuss causes, effects, and solutions",
            "Use proper essay structure with introduction, body, and conclusion",
          ],
          resources: ["Research Articles", "Writing Guidelines"],
        },
      ],
    },
    {
      id: "alex",
      name: "Alex",
      assignments: [
        {
          id: "30001",
          subject: "History",
          title: "World War II Research",
          dateCreated: "18-02-2025",
          dueDate: "26-02-2025",
          teacherName: "Lisa Brown",
          status: "Pending",
          pupilName: "Alex",
          class: "Js3",
          description:
            "Research and write a comprehensive report on World War II, focusing on key events, major battles, and their impact on global history.",
          questions: [
            "Research key events of World War II",
            "Analyze the impact of major battles",
            "Write a 1000-word research paper",
            "Include at least 5 credible historical sources",
          ],
          resources: ["Historical Documents", "Research Guide"],
        },
        {
          id: "30002",
          subject: "Geography",
          title: "Map Reading Exercise",
          dateCreated: "17-02-2025",
          dueDate: "23-02-2025",
          teacherName: "David Lee",
          status: "Completed",
          pupilName: "Alex",
          class: "Js3",
          submissionDate: "22-02-2025",
          score: "88%",
          description:
            "Complete map reading exercises including coordinate systems, scale interpretation, and topographic map analysis.",
          questions: [
            "Identify coordinates for given locations",
            "Calculate distances using map scales",
            "Interpret topographic features",
            "Create a simple route map",
          ],
          resources: ["Map Collection", "Exercise Sheets"],
        },
        {
          id: "30003",
          subject: "Physics",
          title: "Motion and Forces Lab",
          dateCreated: "16-02-2025",
          dueDate: "22-02-2025",
          teacherName: "Anna Davis",
          status: "Completed",
          pupilName: "Alex",
          class: "Js3",
          submissionDate: "21-02-2025",
          score: "94%",
          description:
            "Conduct laboratory experiments to study motion and forces, including velocity calculations and force measurements.",
          questions: [
            "Measure velocity of moving objects",
            "Calculate acceleration from data",
            "Analyze force and motion relationships",
            "Write a lab report with conclusions",
          ],
          resources: ["Lab Manual", "Data Sheets"],
        },
        {
          id: "30004",
          subject: "Chemistry",
          title: "Periodic Table Quiz",
          dateCreated: "15-02-2025",
          dueDate: "21-02-2025",
          teacherName: "Robert Miller",
          status: "Overdue",
          pupilName: "Alex",
          class: "Js3",
          description:
            "Complete a comprehensive quiz on the periodic table, including element properties, trends, and chemical behavior.",
          questions: [
            "Identify element symbols and names",
            "Explain periodic trends",
            "Predict chemical properties",
            "Solve problems related to atomic structure",
          ],
          resources: ["Periodic Table Chart", "Study Guide"],
        },
      ],
    },
  ];

  const currentStudent = students.find((s) => s.name === selectedStudent) || students[0];
  const assignments = currentStudent.assignments;

  // Calculate stats for the selected student
  const pendingCount = assignments.filter((a) => a.status === "Pending").length;
  const completedCount = assignments.filter((a) => a.status === "Completed").length;
  const overdueCount = assignments.filter((a) => a.status === "Overdue").length;

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleStudentSelect = (studentName: string) => {
    setSelectedStudent(studentName);
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assignments.map((g) => g.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = assignments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(assignments.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <div className=" ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 py-4">
            <h1 className="text-sm md:text-xl font-semibold text-gray-900">
              Welcome back, Parent! View {selectedStudent}'s assignments below
            </h1>
            <div className="flex items-center space-x-4">
              {/* Student Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter size={18} />
                  <span className="text-sm">{selectedStudent}</span>
                  <ChevronDown size={16} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute md:right-0 mt-2 w-48 bg-white rounded-md shadow-md z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                        Filter
                      </div>
                      {students.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleStudentSelect(student.name)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {student.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {/* Pending Card */}
          <div className="bg-yellow-200 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
              </div>
              <div className="text-yellow-600">
                <Calendar size={48} className="opacity-50" />
              </div>
            </div>
          </div>

          {/* Completed Card */}
          <div className="bg-green-200 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completedCount}</p>
              </div>
              <div className="text-green-600">
                <CheckSquare size={48} className="opacity-50" />
              </div>
            </div>
          </div>

          {/* Overdue Card */}
          <div className="bg-red-200 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium mb-1">Overdue</p>
                <p className="text-3xl font-bold text-red-900">{overdueCount}</p>
              </div>
              <div className="text-red-600">
                <Clock size={48} className="opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Table Component */}
        <AssignmentTable
          selectAll={selectAll}
          selectedStudent={selectedStudent}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleCheckbox={toggleCheckbox}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          assignments={currentRecords}
          onViewAssignment={handleViewAssignment}
        />
      </div>

      {/* Assignment Modal Component */}
      <AssignmentModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AssignmentDashboard;
