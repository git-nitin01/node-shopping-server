import { Request, Response } from "express";
import { messageDTO } from "../../dto/messageDTO";
import UserPointsService from "../../services/users/userPointsService";
import { instanceToPlain } from "class-transformer";

class UserPointsController {
  private serviceInstance: UserPointsService;
  private static instance: UserPointsController;

  // implement singelton pattern
  private constructor() {
    this.serviceInstance = UserPointsService.getServiceInstance();
  }

  // return controller instance
  static getControllerInstance(): UserPointsController {
    if (!UserPointsController.instance) {
      UserPointsController.instance = new UserPointsController();
    }
    return UserPointsController.instance;
  }

  // creating new points entry for user
  async putEntry(req: Request, res: Response): Promise<void> {
    const transact = {
      userId: req.body.uid,
      transactionType: req.body.type,
      points: req.body.points,
      userDescription: req.body.role,
      referralUserId: req.body?.refer,
      reason: req.body?.reason,
    };
    try {
      const data = await this.serviceInstance.createEntry(transact);
      const message = new messageDTO(
        200,
        "points entry creation success",
        data,
      );
      res.status(200).send(instanceToPlain(message));
    } catch (err: any) {
      console.error("Error creating points entry: ", err); // Log the error
      const message = new messageDTO(500, "Internal Server Error", err.message);
      res.status(500).send(instanceToPlain(message));
    }
  }

  // get existing points entry
  async getEntry(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    this.serviceInstance
      .getPointsEntry(userId)
      .then((data) => {
        res.status(200).send({
          message: "points entry found!",
          data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Internal Server Error",
          error: err,
        });
      });
  }

  // update existing points entry
  async updateEntry(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const points = req.query.points || 0;
    this.serviceInstance
      .updatePointsEntry(userId, +points)
      .then((data) => {
        const message = new messageDTO(200, "points entry found!", { data });
        res.status(200).send(instanceToPlain(message));
      })
      .catch((err) => {
        const message = new messageDTO(500, err);
        res.status(500).send(instanceToPlain(message));
      });
  }

  // delete Entry
  async deleteEntry(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    this.serviceInstance
      .deleteEntry(userId)
      .then((data) => {
        const message = new messageDTO(200, "points entry deletion success!", {
          data,
        });
        res.status(200).send(instanceToPlain(message));
      })
      .catch((err) => {
        const message = new messageDTO(500, err);
        res.status(500).send(instanceToPlain(message));
      });
  }
}

export default UserPointsController;
