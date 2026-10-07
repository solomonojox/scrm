import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import AdminSchoolAccountTable from "./AdminSchoolAcoountTable";
import SchoolAccountForm from "./SchoolAccountForm";
import { schoolAccountService } from "../../../Services/Admin/schoolAccountService";
import { useAuth } from "../../../Context/Auth/useAuth";
import {
  fetchSchoolAccountsFailure,
  fetchSchoolAccountsStart,
  fetchSchoolAccountsSuccess,
} from "../../../Store/Admin/schoolAccountSlice";
import { getErrorMessage } from "../../../utils/getErrorMessage";

const AdminSchoolAccount: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // single record (not a list)
  const account = useSelector(
    (state: RootState) => state.getSchoolAccounts.record
  );
  const loading = useSelector(
    (state: RootState) => state.getSchoolAccounts.loading
  );
  const error = useSelector(
    (state: RootState) => state.getSchoolAccounts.error
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  // ---- Fetch single school account ----
  const fetchSchoolAccount = useCallback(async () => {
    if (!user?.schoolId) {
      dispatch(fetchSchoolAccountsFailure("No school ID available"));
      return;
    }

    dispatch(fetchSchoolAccountsStart());
    try {
      const data = await schoolAccountService.getAccountsBySchoolId(
        user.schoolId
      );

      // console.log("Fetched School Accounts:", data);

      dispatch(fetchSchoolAccountsSuccess(data ?? null));
    } catch (err) {
      dispatch(fetchSchoolAccountsFailure(getErrorMessage(err)));
      // toast.error(getErrorMessage(err));
    }
  }, [dispatch, user?.schoolId]);

  useEffect(() => {
    fetchSchoolAccount();
  }, [fetchSchoolAccount]);

  const handleHeaderSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeaderSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-full mx-auto">
        <AdminSchoolAccountTable
          account={account}
          loading={loading}
          headerSearchQuery={headerSearchQuery}
          onHeaderSearchChange={handleHeaderSearchChange}
          onAddAccount={() => setIsModalOpen(true)}
          onRefresh={fetchSchoolAccount}
        />

        {isModalOpen && (
          <SchoolAccountForm
            onClose={() => setIsModalOpen(false)}
            onAccountAdded={fetchSchoolAccount}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSchoolAccount;