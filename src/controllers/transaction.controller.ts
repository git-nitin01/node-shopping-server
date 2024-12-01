import TransactionService from "../services/transactionService";
import Transaction from "../dto/transactionDTO";
import { Request, Response } from "express";

class TransactionController {
  private serviceInstance: TransactionService;
  private static controllerInstance: TransactionController;
  private constructor() {
    this.serviceInstance = TransactionService.getServiceInstance();
  }
  public static getControllerInstance(): TransactionController {
    if (!TransactionController.controllerInstance) {
      TransactionController.controllerInstance = new TransactionController();
    }
    return TransactionController.controllerInstance;
  }
  public mapToDTO(payload: any): Transaction {
    return {
      uid: payload.uid,
      productId: payload?.productId,
      date: payload.date,
      type: payload.type,
      amount: payload?.amount,
      points: payload?.points,
      comments: payload?.comments,
    };
  }
  public async log(req: Request, res: Response) {
    const payload = req.body;
    const dtoPayload = this.mapToDTO(payload);
    console.log(dtoPayload);
    try {
      const serverResponse =
        await this.serviceInstance.logTransaction(dtoPayload);
      res.status(200).send(serverResponse);
    } catch (err) {
      res.status(500).send(err);
    }
  }
  public async get(req: Request, res: Response) {
    const uid = req.params.uid;
    try {
      const response = await this.serviceInstance.getTransaction(uid);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

export default TransactionController;
