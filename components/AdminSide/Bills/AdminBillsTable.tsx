import React, { useEffect, useState } from 'react';
import { billAction } from '@/utils/billAction'; // Assuming this is the path to billAction
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatAmount } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import AdminBillDetailSheet from './AdminBillSheet';
import { useRouter } from 'next/navigation';


const AdminBillsTable = () => {
  const [bills, setBills] = useState<AdminBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AdminBill; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedBill, setSelectedBill] = useState<AdminBill | null>(null);  // To manage selected bill for details
  const router = useRouter();

  // Function to open the admin bill details popup
  const openBillDetails = (bill: AdminBill) => {
    // console.log("Selected Bill:", bill);  // Log the entire bill object
    // if (bill.invoice_number) {
    setSelectedBill(bill);
    //     router.push(`/create-bill-page?invoice_id=${bill.invoice_number}`);
    //   } else {
    //     console.error("Invoice number is missing for the selected bill");
    //   }
  };

  // Function to close the admin bill details popup
  const closeBillDetails = () => {
    setSelectedBill(null);
    // router.push(`/create-bill-page`); // Remove the invoice_id query parameter when closing
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await billAction.fetchAdminBills();
        setBills(data);
      } catch (error) {
        console.error('Failed to fetch bills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key: keyof AdminBill) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBills = React.useMemo(() => {
    if (sortConfig && sortConfig.key) {
      return [...bills].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof AdminBill];
        const bValue = b[sortConfig.key as keyof AdminBill];

        // Handle undefined values safely
        if (aValue === undefined || bValue === undefined) {
          return 0;  // If either value is undefined, consider them equal
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return bills;
  }, [bills, sortConfig]);

  // const sortedBills = React.useMemo(() => {
  //   if (sortConfig !== null) {
  //     return [...bills].sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key]) {
  //         return sortConfig.direction === 'ascending' ? -1 : 1;
  //       }
  //       if (a[sortConfig.key] > b[sortConfig.key]) {
  //         return sortConfig.direction === 'ascending' ? 1 : -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   return bills;
  // }, [bills, sortConfig]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getSortIcon = (key: keyof AdminBill) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ChevronUp className="inline h-4 w-4" strokeWidth={3} />
      ) : (
        <ChevronDown className="inline h-4 w-4" strokeWidth={3} />
      );
    }
    return <ChevronsUpDown className="inline h-4 w-4" strokeWidth={3} />; // Default icon
  };

  const columns = [
    { label: 'Biller', key: 'biller' as keyof AdminBill },
    { label: 'Amount', key: 'amount' as keyof AdminBill },
    { label: 'Due Date', key: 'due_date' as keyof AdminBill },
    { label: 'Action', key: null }, // actions won't be sorted
  ];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead
              className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('biller')}
            >
              Biller
              <span className="ml-2">{getSortIcon('biller')}</span>
            </TableHead>
            <TableHead
              className="font-inter px-4 font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              Amount
              <span className="ml-2">{getSortIcon('amount')}</span>
            </TableHead>
            <TableHead
              className="font-inter px-2 font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('due_date')}
            >
              Due Date
              <span className="ml-2">{getSortIcon('due_date')}</span>
            </TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedBills.map((bill: AdminBill) => {
            const billerName = bill.biller;
            const amount = bill.amount;
            const dueDate = new Date(bill.due_date);

            return (
              <TableRow key={bill.id} className="border-b cursor-pointer"
                // Admin Bill Sheet on click
                onClick={() => openBillDetails(bill)}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-sm truncate font-semibold text-[#344054]">
                      {billerName}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="font-inter font-semibold">
                  {formatAmount(amount)}
                </TableCell>

                <TableCell className="font-inter min-w-32 pl-2 pr-10 text-[#475467]">
                  {dueDate.toDateString()}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col lg:flex-row justify-start gap-4 px-4">
                    <Button className="bg-white-100 border border-gray-300">Assign User</Button>
                    <Button className="bg-white-100 border border-gray-300">Unassign</Button>
                    <Button className="bg-white-100 border border-gray-300">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

      </Table>

      {selectedBill && (
        <AdminBillDetailSheet
          bill={selectedBill}
          assignedUsers={selectedBill?.assigned_users || []}
          onClose={closeBillDetails}
        />
      )}
      {/* Add Assign Bill Sheet */}
      {/* Add Unassign Bill Sheet */}

    </>
  );
};

export default AdminBillsTable;
