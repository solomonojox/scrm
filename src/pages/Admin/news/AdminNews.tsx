import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import NewsTable from "./NewsTable";
import NewsForm from "./NewsForm";
import { News } from "../../../Types/newsType";
import { newsService } from "../../../Services/News";
import { fetchNewsFailure, fetchNewsStart, fetchNewsSuccess } from "../../../Store/newsSlice";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminNews: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
 const fetchedRecord = useSelector((state: RootState) => state.getNews.listRecords) || [];
  const fetchedLoading = useSelector((state: RootState) => state.getNews.loading);
  const error = useSelector((state: RootState) => state.getNews.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
  const validFetched = Array.isArray(fetchedRecord) ? fetchedRecord : [];

  let filtered = validFetched;

  if (religionFilter !== 'all') {
    filtered = filtered.filter((news: News) =>
      news.newsId?.toLowerCase() === religionFilter
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((news: News) =>
      news.newsId?.toLowerCase().includes(query) ||
      news.publishedDate?.toLowerCase().includes(query) ||
      news.title?.toLowerCase().includes(query) ||
      news.content?.toLowerCase().includes(query)
    );
  }

  return filtered;
}, [fetchedRecord, searchQuery, religionFilter]);


  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  useEffect(() => {
    if (!fetchedLoading) {
      fetchNews();
    }
  }, [dispatch]);

  const fetchNews = async () => {
    dispatch(fetchNewsStart());
    try {
      const data = await newsService.getAllRegisteredNews();
      dispatch(fetchNewsSuccess(data));
    } catch (err) {
      dispatch(fetchNewsFailure((err as Error).message));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((n) => n.newsId));
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      await newsService.delete(id);
      await fetchNews();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <NewsTable
          records={currentRecords}
          totalRecords={filteredRecords.length}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          headerSearchQuery={headerSearchQuery}
          religionFilter={religionFilter}
          selectedIds={selectedIds}
          selectAll={selectAll}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onHeaderSearchChange={handleHeaderSearchChange}
          onReligionFilterChange={setReligionFilter}
          onToggleSelectAll={toggleSelectAll}
          onToggleCheckbox={toggleCheckbox}
          onDelete={handleDelete}
          onAddNews={() => setIsModalOpen(true)}
          onRefresh={fetchNews}
        />

        {isModalOpen && (
          <NewsForm
            onClose={() => setIsModalOpen(false)}
            onNewsAdded={fetchNews}
          />
        )}
      </div>
    </div>
  );
};

export default AdminNews;