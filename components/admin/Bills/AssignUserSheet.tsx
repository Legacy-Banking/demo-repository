"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/Spinner"; // Import the new Spinner component

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/shadcn_ui/dialog";
import { Button } from "@/components/shadcn_ui/button";
import { Switch } from "@/components/shadcn_ui/switch";
import { Checkbox } from "@/components/shadcn_ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn_ui/table";
import { billAction } from "@/lib/actions/billAction";
import { userAction } from "@/lib/actions/userAction";
import SearchBar from "@/components/SearchBar";

interface AssignUserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  biller: Biller;
  amount: number;
  description: string;
  due_date: Date;
  linkedBill: string;
  assignedUsers: string;
  onAssignComplete?: (billId: string) => Promise<void>;
}

const AssignUserSheet: React.FC<AssignUserSheetProps> = ({ isOpen, onClose, biller, amount, description, due_date, linkedBill, assignedUsers, onAssignComplete }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [users, setUsers] = useState<{ id: string; owner_username: string; last_sign_in_at: string | null }[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [assigning, setAssigning] = useState<boolean>(false); // Loading state for assigning users

  const fetchUsers = async () => {
    try {
      setLoading(true); // Start loading when fetching users
      // Fetch the current assigned users from the linkedBill (admin bill)
      const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(linkedBill); // Assume you have a function to fetch the bill by ID

      // Split assigned users into an array
      const assignedUsersArray = currentAssignedUsers
        ? currentAssignedUsers.split(",").map((user: string) => {
          const [username, id] = user.split("|"); // Split "username|id"
          return { id: id.trim(), owner_username: username.trim() };
        })
        : [];

      // Extract just the ids of assigned users
      const assignedUserIds = assignedUsersArray.map((user: { id: string; owner_username: string }) => user.id);

      // Fetch all users
      const fetchedOwners = await userAction.fetchUniqueOwners();

      // Fetch all users from the admin list (to get last_sign_in_at)
      const adminUsers = await userAction.listMostRecentUsers();

      // Map the fetched owners to include last_sign_in_at from the adminUsers
      const mappedUsers = fetchedOwners
        .map((owner) => {
          const adminUser = adminUsers.find((u) => u.id === owner.owner); // Match by user id
          return {
            id: owner.owner, // Map `owner` to `id`
            owner_username: owner.owner_username,
            last_sign_in_at: adminUser ? adminUser.last_sign_in_at : null, // Get last_sign_in_at if available
          };
        })
        .filter(user => !assignedUserIds.includes(user.id)); // Filter out already assigned users
      setUsers(mappedUsers);

    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers(); // Fetch users when the sheet is opened
    }
  }, [isOpen, linkedBill]);

  // Reset selected users when the sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]); // Clear selected users when sheet closes
      setInputValue("");
      setActiveOnly(false);
    }
  }, [isOpen]);

  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) {
      console.error("No users selected to assign the bill to");
      return;
    }

    setAssigning(true); // Set loading to true

    try {
      // Call the createBillForUsers function from billAction
      await billAction.createBillForUsers(selectedUsers, biller, amount, description, due_date, linkedBill);

      // Fetch the current assigned users from the linkedBill (admin bill)
      const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(linkedBill); // Assume you have a function to fetch the bill by ID

      // Map selected user IDs to usernames and filter out any null values
      const selectedUsersWithIds = selectedUsers.map(userId => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.owner_username}|${user.id}` : null;
      }).filter(Boolean); // Remove any null values

      // If currentAssignedUsers exists, split it into an array; otherwise, use an empty array
      const existingUserArray = currentAssignedUsers && currentAssignedUsers.length > 0
        ? currentAssignedUsers.split(",").map((user: string) => user.trim())
        : [];

      // Merge and deduplicate both existing and new assigned users
      const updatedAssignedUsersArray = [...existingUserArray, ...selectedUsersWithIds].filter((value, index, self) => self.indexOf(value) === index);

      // Join the array back into a string
      const updatedAssignedUsers = updatedAssignedUsersArray.join(", ");

      // Update the assigned users in the Admin Bill
      await billAction.updateAssignedUsers(linkedBill, updatedAssignedUsers);

      // Call onAssignComplete if it exists
      if (onAssignComplete) {
        await onAssignComplete(linkedBill);
      }

      setAssigning(false); // Set loading to false before closing

      // Optionally, you can close the dialog or reset the selected users
      onClose();

    } catch (error) {
      console.error("Failed to assign bills to users:", error);
      setAssigning(false); // Set loading to false on error
    }
  };

  const isUserActive = (lastSignInAt: string | null) => {
    if (!lastSignInAt) return false;
    const lastSignInDate = new Date(lastSignInAt);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    return lastSignInDate > oneHourAgo; // Check if last sign-in was within the last hour
  };

  // filter for search and recently active
  const filteredUsers = users
    .filter(user => user.owner_username.toLowerCase().includes(inputValue.toLowerCase()))
    .filter(user => !activeOnly || isUserActive(user.last_sign_in_at));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-2xl h-full max-h-[90vh] 3xl:max-h-[70vh] rounded-lg flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-inter">Assign User</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 font-inter">
            Select the users to whom the bill should be assigned
          </DialogDescription>
        </DialogHeader>

        {/* Search & Toggle Active Users */}
        <div className="flex items-center justify-between py-4">
          <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-inter">Active Users</span>
            <Switch
              checked={activeOnly}
              onCheckedChange={setActiveOnly}
              className={`ml-2 ${activeOnly ? 'bg-blue-200' : 'bg-gray-300'}`}
            />
          </div>
        </div>

        {/* User List Table or Loader */}
        <div className="min-h-[400px] flex-grow overflow-auto"> {/* Use the same height for consistency */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="large" className="text-blue-500" />
            </div>
          ) : (
            <div className="overflow-y-auto h-full max-h-[60vh] border-t border-b border-gray-300 rounded-tl-2xl rounded-tr-2xl">
              <Table>
                <TableHeader className="bg-blue-200">
                  <TableRow>
                    <TableHead className="px-8 text-left text-sm font-normal font-inter tracking-wider text-white-100">Username</TableHead>
                    <TableHead className="font-inter font-normal text-white-100 whitespace-nowrap">
                      <div className="flex justify-end items-center space-x-4 mr-12">
                        <span>Assign All</span>
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length}
                          onCheckedChange={() =>
                            setSelectedUsers(
                              selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id)
                            )
                          }
                          className="custom-checkbox border-white-100"
                        />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-t border-gray-200 hover:bg-gray-200" onClick={() => handleSelectUser(user.id)}>
                      <TableCell className="px-8 font-inter text-sm word-break: break-all">{user.owner_username}</TableCell>
                      <TableCell className="px-8">
                        <div className="text-right mr-12">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                            className="custom-checkbox"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Assign Button */}
        {!loading && (
          <DialogFooter>
            <Button onClick={handleAssignUsers} className="w-full bg-blue-gradient hover:bg-blue-200 hover:underline text-white-100 transition-all duration-200" disabled={assigning}>
              {assigning ? 'Assigning...' : 'Assign Users'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignUserSheet;
