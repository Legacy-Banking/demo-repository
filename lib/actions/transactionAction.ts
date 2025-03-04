import { createClient } from "../supabase/client";
import { capitalizeFirstLetter } from "@/lib/utils/utils";

export const transactionAction = {
    createTransaction: async (fromAccount: Account, toAccount: Account, amount: number, description: string, transactionType: string): Promise<void> => {
        const supabase = createClient();

        if (amount === 0) {
            throw new Error('Transaction amount cannot be zero.');
        }

        const fromNewBalance = fromAccount.balance - amount;
        const toNewBalance = toAccount.balance + amount;

        let from_username: string;
        let to_username: string;

        if (transactionType === 'transfer funds') {
            from_username = `${fromAccount.owner_username} - ${capitalizeFirstLetter(fromAccount.type)} Account`;
            to_username = `${toAccount.owner_username} - ${capitalizeFirstLetter(toAccount.type)} Account`;
        } else if (transactionType === 'pay anyone') {
            from_username = fromAccount.owner_username;
            to_username = toAccount.owner_username;
        } else {
            throw new Error(`Unsupported transaction type: ${transactionType}`);
        }


        if (fromNewBalance < 0) {
            throw new Error('Insufficient funds');
        }

        try {
            // Update the 'from' account balance
            await transactionAction.updateAccounts(fromAccount, fromNewBalance);

            // Update the 'to' account balance
            await transactionAction.updateAccounts(toAccount, toNewBalance);

            // Insert the new transaction
            const newTransaction: Partial<Transaction> = {
                description: description,
                amount: amount,
                paid_on: new Date(),
                from_account: fromAccount.id,
                from_account_username: from_username,
                to_account: toAccount.id,
                to_account_username: to_username,
                transaction_type: transactionType,
            };

            const { error: insertError } = await supabase
                .from('transaction')
                .insert(newTransaction);

            if (insertError) {
                // Revert both account updates if the transaction insertion fails
                await transactionAction.updateAccounts(fromAccount, fromAccount.balance);
                await transactionAction.updateAccounts(toAccount, toAccount.balance);

                console.error('Failed to insert the transaction:', insertError);
                throw new Error('Transaction failed, reverting operations.');
            }
        } catch (error) {
            // If updating either account fails, revert any successful updates
            console.error('Transaction error:', error);

            if (fromAccount.balance !== fromNewBalance) {
                await transactionAction.updateAccounts(fromAccount, fromAccount.balance);
            }

            if (toAccount.balance !== toNewBalance) {
                await transactionAction.updateAccounts(toAccount, toAccount.balance);
            }

            throw error;
        }
    },

    createTransactionPreset: async (preset: string, owner_account: Account, owner_username: string ,amount: number, description: string, date_issued: Date): Promise<void> => {
        const supabase = createClient();

        try {
            // Insert the new transaction
            const newTransaction: Partial<Transaction> = {
                description: description,
                from_account: amount > 0 ? undefined : owner_account.id,
                from_account_username: amount > 0 ? preset : owner_username,
                to_account: amount > 0 ? owner_account.id : undefined,
                to_account_username: amount > 0 ? owner_username : preset,
                amount: amount < 0 ? amount * -1 : amount,
                paid_on: date_issued,
                transaction_type: 'pay anyone',
            };

            const { error: insertError } = await supabase
                .from('transaction')
                .insert(newTransaction);
            }
         catch (error) {
            // If updating either account fails, revert any successful updates
            console.error('Transaction error:', error);

            throw error;
        }
    },

    createBPAYTransaction: async (
        fromAccount: Account,
        billerName: string,
        billerCode: string,
        referenceNum: string,
        amount: number,
        description: string,
    ): Promise<void> => {
        const supabase = createClient();

        if (amount === 0) {
            throw new Error('Transaction amount cannot be zero.');
        }

        const fromNewBalance = fromAccount.balance - amount;

        if (fromNewBalance < 0) {
            throw new Error('Insufficient funds');
        }

        try {
            // Update the 'from' account balance
            // Construct the detailed description including biller details
            const detailedDescription = `${description} Bill Details | Biller: ${billerName}, Code: ${billerCode}, Ref: ${referenceNum}`;

            // Insert the new BPAY transaction
            const newTransaction: Partial<Transaction> = {
                description: detailedDescription,
                amount: amount,
                paid_on: new Date(),
                from_account: fromAccount.id,
                from_account_username: fromAccount.owner_username,
                to_account_username: billerName,
                transaction_type: "bpay",
            };

            const { error: insertError } = await supabase
                .from('transaction')
                .insert(newTransaction);

            if (insertError) {
                console.error('Failed to insert the BPAY transaction:', insertError);
                throw new Error('Transaction failed, reverting operations.');
            }
        } catch (error) {
            
            console.error('Transaction error:', error);
            throw error;
        }
    },


    updateAccounts: async (account: Account, newBalance: number): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('account')
            .update({ balance: newBalance })
            .eq('id', account.id);

        if (error) {
            throw new Error(`Failed to update account ${account.id}: ${error.message}`);
        }
    },

    getTransactionsByAccountId: async (accountId: string): Promise<Transaction[]> => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('transaction')
            .select('*')
            .or(`from_account.eq.${accountId},to_account.eq.${accountId}`)
            .order('paid_on', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        const transactions = data as Transaction[];
        transactionAction.processTransactionsForAccount(transactions, accountId);
        return transactions;
    },

    processTransactionsForAccount: (transactions: Transaction[], accountId: string): void => {
        transactions.forEach((t) => {
            // Check if `from_account` is null before accessing it
            if (t.from_account !== null && t.from_account.toString() === accountId) {
                // If the transaction is from this account, negate the amount
                t.amount = -t.amount;
            }
            // If from_account is null (Admin transaction), or the account doesn't match, do nothing
        });
    
    },

    fetchTransactionPresetsOnCreation: async (): Promise<TransactionPresetType[]> => {
        const supabase = createClient();
    
        // Fetching transaction presets from the 'transaction_presets' table
        const { data, error } = await supabase
            .from('transaction_presets')
            .select('*');
    
        if (error) {
            console.error('Error fetching transaction presets:', error);
            throw error;
        }
    
        // Ensuring data is defined to avoid runtime errors
        if (!data) {
            console.warn('No transaction presets found.');
            return [];
        }
    
        const transactions = data as TransactionPresetType[];
    
        return transactions;
    },    
    fetchTransactionPresets: async (): Promise<Transaction[]> => {
        const supabase = createClient();

        // Fetching transaction presets from the 'transaction_presets' table
        const { data, error } = await supabase
            .from('transaction_presets')
            .select('*');

        const transactions = data as TransactionPresetType[]

        const transformedData = transactions.map(transaction => {
            const isPayingRecipient = transaction.amount < 0;
            
            return {
                id: `${transaction.id}-${transaction.recipient}`, // Ensure unique ID format
                description: "A 'Preset Transaction' set by your instructor.",
                amount: transaction.amount,
                paid_on: transaction.date_issued,
                from_account: isPayingRecipient ? 'user' : 'default', // Replace with actual logic if needed
                from_account_username: isPayingRecipient ? 'user' : transaction.recipient,
                to_account: isPayingRecipient ? 'default' : 'user',
                to_account_username: isPayingRecipient ? transaction.recipient : 'user',
                transaction_type: 'pay anyone', // Adjust based on your requirements
            };
        });
    
        return transformedData as Transaction[];
    },

    fetchTotalTransactionAmount : async (): Promise<number> => {
        const supabase = createClient();
    
        // Execute the SQL query using select() and get the sum of all amounts
        const { data, error } = await supabase
            .from('transaction_presets')
            .select('amount', { count: 'exact' });
    
        if (error) {
            console.error('Error fetching total sum of transaction amounts:', error);
            throw error;
        }
    
        // Calculate the total sum of all transaction amounts in JavaScript
        const totalSum = data?.reduce((acc: number, transaction: any) => acc + (transaction.amount || 0), 0);
    
        return totalSum || 0;
    },
    
    adminAddFunds : async (
        toAccount: Account, 
        amount: number, 
        description: string
      ): Promise<void> => {
        const supabase = createClient();
      
        if (amount === 0) {
          throw new Error('Transaction amount cannot be zero.');
        }
      
        // Static "Admin" account details
        const fromAccount = {
          id: 'admin-id',  // Unique ID for the Admin account (hardcoded, adjust as needed)
          owner_username: 'Admin',
          balance: Infinity,  // Infinite balance for admin
          type: 'admin',  // Account type is "admin"
          opening_balance: Infinity  // Admin account has no opening balance limit
        };
      
        const from_username = `${fromAccount.owner_username} Account`;
        const to_username = toAccount.owner_username;
      
        const toNewBalance = toAccount.balance + amount;
      
        try {
          // Update the 'to' account balance
          await transactionAction.updateAccounts(toAccount, toNewBalance);
      
          // Insert the new transaction with 'Admin' as the sender
          const newTransaction: Partial<Transaction> = {
            description: description,
            amount: amount,
            paid_on: new Date(),
            from_account_username: from_username,
            to_account: toAccount.id,
            to_account_username: to_username,
            transaction_type: 'add funds',  // Specific transaction type for adding funds
          };
      
          const { error: insertError } = await supabase
            .from('transaction')
            .insert(newTransaction);
      
          if (insertError) {
            // Revert account balance update if transaction insertion fails
            await transactionAction.updateAccounts(toAccount, toAccount.balance);
            console.error('Failed to insert the transaction:', insertError);
            throw new Error('Transaction failed, reverting operations.');
          }
        } catch (error) {
          // If updating the account balance fails, revert any successful updates
          console.error('Transaction error:', error);
      
          if (toAccount.balance !== toNewBalance) {
            await transactionAction.updateAccounts(toAccount, toAccount.balance);
          }
      
          throw error;
        }
    },
    
};


