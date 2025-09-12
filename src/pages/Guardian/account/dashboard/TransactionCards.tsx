import React from "react";
import { HiOutlineChat } from "react-icons/hi";

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
    green: "from-[#45B20ACC] via-[#45B20ACC] to-[#45B20ACC]",
    blue: "from-[#8979FFB2] via-[#8979FFB2] to-[#8979FFB2]",
  } as Record<string, string>;
  return (
    <div
      className={`w-56 h-36 rounded-2xl text-white shadow-xl relative transition-all duration-500 cursor-pointer hover:-translate-y-2`}
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

const TransactionCards: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between mb-8">
      {/* Cards section */}
      <section className="relative mb-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center group relative">
            <div
              className="transform transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:mr-8 -mr-8"
              style={{ zIndex: 30 }}
            >
              <StatCard
                title="Savings Account"
                value={"********"}
                accent="green"
                count={2}
                z={30}
              />
            </div>
            <div
              className="transform -translate-x-6 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:mr-8"
              style={{ zIndex: 20 }}
            >
              <StatCard title="Loan Account" value={"********"} accent="blue" count={2} z={20} />
            </div>
          </div>

          <div className="ml-auto w-72 h-36 rounded-2xl border border-[#1D0F81] flex flex-col items-center justify-center text-center p-4 shadow-lg bg-white/60 backdrop-blur-md">
            <HiOutlineChat className="mb-3 text-[#1D0F81]" size={42} />
            <p className="text-xs leading-tight text-gray-600">
              Your messages will appear here once someone responds to you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransactionCards;
