import { Request, Response } from "express";
import UserAddressService from "../../services/users/userAddressService";

class UserAddressController {
  private serviceInstance: UserAddressService;
  private static instance: UserAddressController;

  // implement singelton pattern
  private constructor() {
    this.serviceInstance = UserAddressService.getServiceInstance();
  }

  // return controller instance
  static getControllerInstance(): UserAddressController {
    if (!UserAddressController.instance) {
      UserAddressController.instance = new UserAddressController();
    }
    return UserAddressController.instance;
  }

  // creating new address entry for user
  async putEntry(req: Request, res: Response): Promise<void> {
    const resource = req.body;
    try {
      await this.serviceInstance.createAddress(resource);
      res.status(200).send({
        message: "address entry created!",
      });
    } catch (err: any) {
      res.status(500).send({
        message: `${err} - address entry creation failed!`,
      });
    }
  }

  // get existing points entry
  async getEntry(req: Request, res: Response): Promise<void> {
    const uid = req.params.id;
    this.serviceInstance
      .getAddressEntry(uid)
      .then((data) => {
        res.status(200).send({
          message: "address entry found!",
          addressData: data,
        });
      })
      .catch((err) => {
        res.status(404).send({
          message: `${err} - address entry not found!`,
        });
      });
  }

  // delete Entry
  async deleteEntry(req: Request, res: Response): Promise<void> {
    const uid = req.params.id;
    const dataId = req.query.id as string;
    this.serviceInstance
      .deleteEntry(uid, dataId)
      .then(() => {
        res.status(200).send({
          message: "address entry deleted!",
        });
      })
      .catch((err) => {
        res.status(404).send({
          message: `${err} - address entry not found!`,
        });
      });
  }

  // update entry
  async updateEntry(req: Request, res: Response): Promise<void> {
    const resource = req.body;
    this.serviceInstance
      .updateEntry(resource)
      .then((data) => {
        res.status(200).send({
          message: "address entry updated!",
          addressData: data,
        });
      })
      .catch((err) => {
        res.status(404).send({
          message: `${err} - address entry not found!`,
        });
      });
  }
}

export default UserAddressController;
