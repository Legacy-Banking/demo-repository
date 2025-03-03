'use client';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, updateUserId, updateUserName, updateUserRole } from "../../store/userSlice";
import { useAppSelector } from '@/store/hooks';
import BankNavbar from "@/components/BankNavbar";
import { accountAction } from "@/lib/actions/accountAction";
import { userAction } from "@/lib/actions/userAction";
import { Toaster } from "react-hot-toast";
import { initializeAuthListeners, cleanupListeners } from "@/hooks/useSignoutOnUnload";

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useAppSelector(state => state.user);
    const user_id = user.user_id;
    const dispatch = useAppDispatch();
    const [personalAccount, setPersonalAccount] = useState(null); // Store personal account
    const router = useRouter(); // useRouter for client-side redirect

    // Fetch the personal account using the utility function
    const fetchUserPersonalAccount = async () => {
        try {
            const personalAccountData = await accountAction.fetchPersonalAccountByUserId(user_id);
            setPersonalAccount(personalAccountData);
        } catch (error) {
            console.error('Error fetching personal account:', error);
        }
    };

    const userStateUpdate = async () => {
        if (!user_id) {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                toast.error("Not logged in, redirecting..."); // Show toast notification
                router.push('/')
            } else {
                dispatch(updateUserId(data.user.id));
                dispatch(updateUserName(data.user.email!));
            }
        }
    };
    const userRoleUpdate = async () => {
        if (user_id) {
            const userRole = await userAction.fetchUserRole(user_id);
            dispatch(updateUserRole(userRole));
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            await userStateUpdate();
            await userRoleUpdate();
            if (user_id) {
                await fetchUserPersonalAccount(); // Fetch personal account after user ID is set
            }
        };
        fetchUserData();


        // Initialize auth-related listeners (idle detection, tab close)
        initializeAuthListeners(router, dispatch);

        // Cleanup listeners and idle timer on component unmount
        return () => {
            cleanupListeners();
        };

    }, [user_id]); // Watch for changes in user_id

    return (
        <div>
            <Toaster />
            <BankNavbar personalAccount={personalAccount} />
            <main>
                {children}
            </main>
        </div>
    );
};

export default AuthenticatedLayout;
