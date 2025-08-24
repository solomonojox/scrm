import { HiOutlineChat } from "react-icons/hi";
import GuardianSidebar from "../GuardianSidebar";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer";

type LoanRequest = {
  id: string;
  name: string;
  guardianId: string;
  phone: string;
  purpose: string;
  amount: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
};

const sampleData: LoanRequest[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `1000${i + 1}`,
  name: "David Ethan",
  guardianId: "104567",
  phone: "17034578999",
  purpose: "School Fees",
  amount: "N115,000",
  date: "23-06-2025",
  status: "Approved",
}));

type StatCardProps = {
  title: string;
  value: string;
  accent: string;
  count?: number | string;
  z?: number;
};

function StatCard({ title, value, accent, count, z = 10 }: StatCardProps) {
  const gradient = {
    red: "from-red-600 via-red-500 to-red-400",
    indigo: "from-indigo-500 via-indigo-400 to-indigo-300",
    green: "from-green-500 via-green-400 to-green-300",
  } as Record<string, string>;
  return (
    <div
      className={`w-44 h-36 rounded-2xl text-white shadow-xl relative transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
      style={{ zIndex: z }}
    >
      <div
        className={`rounded-2xl w-full h-full bg-gradient-to-br ${
          gradient[accent] || gradient.red
        } p-4 relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent)]" />

        <div className="flex justify-between items-start">
          <p className="text-[11px] font-medium tracking-wide">{title}</p>
          <button className="bg-white/20 backdrop-blur-md rounded-full w-6 h-6 flex items-center justify-center text-white text-xs hover:bg-white/30 transition">
            <i className="fas fa-wrench" />
          </button>
        </div>

        <p className="text-2xl font-extrabold font-mono mt-3 tracking-wider drop-shadow-sm">
          {value}
        </p>

        <div className="absolute bottom-3 left-4">
          <p className="text-[11px] opacity-80">Account Holder</p>
          <p className="font-semibold text-sm">David Ethan</p>
        </div>

        {count !== undefined && (
          <span className="absolute bottom-3 right-3 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Loans() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-[#EDEDED] font-inter">

      {/* Content + Footer wrapper with margin-left */}
      <div className="flex-1 flex flex-col">

        {/* Main */}
        <main className="flex-1 py-6 bg-[#EDEDED]  mr-5 w-full">
          <h2 className="font-semibold text-gray-900 text-base mb-3">
            Need Financial Support? Apply for a Loan Today!
          </h2>

          <div className="bg-white p-4 rounded-md shadow-sm">
            {/* Cards section */}
            <section className="relative mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center group relative">
                  <div
                    className="transform transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:mr-8 -mr-8"
                    style={{ zIndex: 30 }}
                  >
                    <StatCard
                      title="Active Loans"
                      value={"********"}
                      accent="red"
                      count={2}
                      z={30}
                    />
                  </div>
                  <div
                    className="transform -translate-x-6 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:mr-8"
                    style={{ zIndex: 20 }}
                  >
                    <StatCard
                      title="Current Loans pending"
                      value={"***"}
                      accent="indigo"
                      count={2}
                      z={20}
                    />
                  </div>
                  <div
                    className="transform -translate-x-12 transition-all duration-500 ease-in-out group-hover:translate-x-0"
                    style={{ zIndex: 10 }}
                  >
                    <StatCard
                      title="Total Loans Closed"
                      value={"****"}
                      accent="green"
                      count={10}
                      z={10}
                    />
                  </div>
                </div>

                <div className="ml-auto w-72 h-36 rounded-2xl border border-[#1D0F81] flex flex-col items-center justify-center text-center p-4 shadow-lg bg-white/60 backdrop-blur-md">
                  <HiOutlineChat className="mb-3 text-[#1D0F81]" size={42} />
                  <p className="text-xs leading-tight text-gray-600">
                    Your messages will appear here once someone responds to you.
                  </p>
                </div>

                <button
                  aria-label="Filter loans"
                  className="ml-4 self-start text-gray-600 hover:text-gray-800"
                >
                  <i className="fas fa-filter" />
                </button>
              </div>
            </section>

            {/* Loan requests section */}
            <section className="bg-white p-4 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-base">
                  Loan Requests
                </h3>
                <div className="flex space-x-2">
                  <button
                    className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md font-semibold hover:bg-orange-600"
                    type="button"
                    onClick={() => navigate("/guardian/loan-request-form")}
                  >
                    + Request Loan
                  </button>
                  <button
                    className="bg-orange-600 text-white text-xs px-3 py-1 rounded-md font-semibold hover:bg-orange-700"
                    type="button"
                    onClick={() => navigate("/guardian/all-loan-request")}
                  >
                    All Loan Request
                  </button>
                </div>
              </div>

              {/* Table headers */}
              <div className="hidden md:grid grid-cols-9 gap-4 text-xs text-gray-600 border-b border-gray-300 px-3 py-2">
                <div className="font-semibold">SN</div>
                <div className="font-semibold">Name</div>
                <div className="font-semibold">Guardian ID</div>
                <div className="font-semibold">Phone</div>
                <div className="font-semibold">Purpose</div>
                <div className="font-semibold">Amount</div>
                <div className="font-semibold text-center">Date</div>
                <div className="font-semibold">Status</div>
                <div className="font-semibold">Action</div>
              </div>

              {/* Loan rows */}
              <div className="mt-4 space-y-4">
                {sampleData.map((row) => (
                  <div
                    key={row.id}
                    className="bg-white shadow-md rounded-md p-4 w-full grid grid-cols-9 gap-4 items-center text-xs text-gray-700"
                  >
                    <div>{row.id}</div>
                    <div>{row.name}</div>
                    <div>{row.guardianId}</div>
                    <div>{row.phone}</div>
                    <div>{row.purpose}</div>
                    <div>{row.amount}</div>
                    <div className="text-center whitespace-nowrap">{row.date}</div>
                    <div className="font-semibold text-green-600">{row.status}</div>
                    <div className="flex items-center justify-end space-x-3 text-gray-600">
                      <button
                        aria-label="View details"
                        className="hover:text-gray-900"
                      >
                        <i className="far fa-eye" />
                      </button>
                      <button
                        aria-label="Chat"
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="far fa-comment-alt" />
                      </button>
                      <button
                        aria-label="Download PDF"
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <i className="far fa-file-pdf" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
