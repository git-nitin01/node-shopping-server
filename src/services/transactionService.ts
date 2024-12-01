import transactionModel from "../models/transaction.model";
import Transaction from "../dto/transactionDTO";

class TransactionService {
  private static serviceInstance: TransactionService;
  private constructor() {}
  public static getServiceInstance(): TransactionService {
    if (!this.serviceInstance) {
      TransactionService.serviceInstance = new TransactionService();
    }
    return TransactionService.serviceInstance;
  }
  public async logTransaction(transaction: Transaction) {
    try {
      const newLog = new transactionModel(transaction);
      const savedLog = await newLog.save();
      return savedLog;
    } catch (err) {
      throw new Error(`Unable to log transaction in database: ${err}`);
    }
  }
  public async getTransaction(uid: string) {
    try {
      const transactions = await transactionModel.find({ uid: uid });
      return transactions;
    } catch (err) {
      throw new Error(`Unable to fetch transactions from database: ${err}`);
    }
  }
}

export default TransactionService;
