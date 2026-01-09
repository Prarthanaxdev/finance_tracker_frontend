import { addTransaction } from "../api/addTransaction";
import { updateTransaction } from "../api/updateTransaction";
import { deleteTransaction } from "../api/deleteTransaction";

interface TransactionData {
  categoryId: string;
  amount: string;
  description: string;
}

interface SaveTransactionParams {
  token: string;
  formData: TransactionData;
  type: "income" | "expense";
  editingId: string | null;
}

export const saveTransaction = async ({
  token,
  formData,
  type,
  editingId,
}: SaveTransactionParams): Promise<string> => {
  if (editingId) {
    const user = localStorage.getItem("authUser");
    const userId = user
      ? (JSON.parse(user)?._id as string | undefined)
      : undefined;
    await updateTransaction(token, {
      _id: editingId,
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      type,
      userId,
      isDeleted: false,
    });
    return "Transaction updated successfully";
  } else {
    await addTransaction(token, {
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      type,
    });
    return "Transaction added successfully";
  }
};

export const removeTransaction = async (
  token: string,
  id: string,
): Promise<void> => {
  await deleteTransaction(token, { id });
};
