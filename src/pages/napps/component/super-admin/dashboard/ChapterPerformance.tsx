const chapters = [
    { name: "NAPPS Lagos Chapter", revenue: "₦475K", share: "₦95K", schools: 3, students: 950 },
    { name: "NAPPS Abuja Chapter", revenue: "₦245K", share: "₦49K", schools: 2, students: 490 },
    { name: "NAPPS Rivers Chapter", revenue: "₦75K", share: "₦15K", schools: 1, students: 150 },
];

export const ChapterPerformance = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Chapter Performance</h2>
        <div className="space-y-4">
            {chapters.map((chapter, idx) => (
                <div key={idx} className="p-5 bg-gray-50/50 rounded-xl border border-gray-100 relative">
                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        20% Share
                    </span>
                    <h3 className="font-bold text-gray-900 mb-4">{chapter.name}</h3>

                    <div className="flex gap-12">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Expected Revenue</p>
                            <p className="text-lg font-bold text-gray-900">{chapter.revenue}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Chapter Share</p>
                            <p className="text-lg font-bold text-green-600">{chapter.share}</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-4 italic">
                        {chapter.schools} schools • {chapter.students} students
                    </p>
                </div>
            ))}
        </div>
    </div>
);