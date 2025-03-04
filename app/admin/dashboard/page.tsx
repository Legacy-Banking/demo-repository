"use client";

import AccountsPage from '@/components/admin/Accounts/AccountsPage';
import AdminSideBar from '@/components/admin/AdminSideBar'
import CreateBillPage from '@/components/admin/Bills/CreateBillPage';
import PresetsPage from '@/components/admin/Presets/PresetsPage';
import { useAppSelector } from '@/store/hooks';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import BankNavbar from '@/components/BankNavbar';
import { accountAction } from '@/lib/actions/accountAction';
import CMSPage from '@/components/admin/CMS/CMSPage';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('accounts');
  const userRole = useAppSelector(state => state.user.user_role);
  const router = useRouter();
  const user_id = useAppSelector(state => state.user.user_id);
  const [personalAccount, setPersonalAccount] = useState(null); // Store personal account

  if (userRole !== 'admin') {
    router.push('/'); // Redirect to home if not admin
  }

  // Fetch the personal account using the utility function
  const fetchUserPersonalAccount = async () => {
    try {
      const personalAccountData = await accountAction.fetchPersonalAccountByUserId(user_id);
      setPersonalAccount(personalAccountData);
    } catch (error) {
      console.error('Error fetching personal account:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_id) {
        await fetchUserPersonalAccount(); // Fetch personal account after user ID is set
      }
    };
    fetchUserData();

  }, [user_id]); // Watch for changes in user_id

  const renderActivePage = () => {
    switch (activePage) {
      case 'accounts':
        return <AccountsPage />;
      case 'presets':
        return <PresetsPage />;
      case 'create-bill':
        return <CreateBillPage />;
      case 'content-management-system':
        return <CMSPage />;
      default:
        return <AccountsPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BankNavbar personalAccount={personalAccount} />
      <div className="flex flex-auto">
        <AdminSideBar activePage={activePage} setActivePage={setActivePage} />
        <main className="bg-[#FCFCFD] flex-auto border-[#D7D7D7] border-x-2 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard;


