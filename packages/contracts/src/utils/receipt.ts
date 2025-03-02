import type { ProcessedReceipt } from '@nilfoundation/niljs';

export const expectAllReceiptsSuccess = (receipts: ProcessedReceipt[]) => {
  for (const receipt of receipts) {
    if (!receipt.success) throw Error(`Message failed: ${receipt.transactionHash}`);
  }
  return receipts;
};