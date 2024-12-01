/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import UserService from "../../services/users/userService";
import { userDTO } from "../../dto/Users/userDTO";
import UserPointsService from "../../services/users/userPointsService";
// import { Session } from "inspector";
// import { access } from "fs";

class UserController {
  private serviceInstance: UserService;
  private static instance: UserController;
  private pointsInstance: UserPointsService;

  // implement singelton pattern
  private constructor() {
    this.serviceInstance = UserService.getServiceInstance();
    this.pointsInstance = UserPointsService.getServiceInstance();
  }

  // return controller instance
  static getControllerInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  // creating new user
  async createUser(req: Request, res: Response): Promise<void> {
    const userDetails = new userDTO(
      req.body.uid,
      req.body.email,
      req.body.role,
    );
    this.serviceInstance
      .createNewUser(userDetails)
      .then(async (_data) => {
        this.pointsInstance
          .createEntry({
            userId: req.body.uid,
            transactionType: "new user login",
            points: 500,
            userDescription: req.body.role,
            referralUserId: req.body?.refer,
            reason: req.body?.reason,
          })
          .then(async (_) => {
            res.status(201).send({
              message: "user created at admin",
            });
          });
      })
      .catch((error) => {
        res.status(500).send({
          message: "user creation failed at admin",
          error: error,
        });
      });
  }

  // getting user by email and username
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.query as { email: string };
    this.serviceInstance
      .getByEmail(email)
      .then((data) => {
        res.status(200).send({
          message: "user details fetch success!",
          data: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "user details fetch failed!",
          error: error,
        });
      });
  }

  // getting all users
  // admin only
  async getallUsers(_req: Request, res: Response): Promise<void> {
    this.serviceInstance
      .getAllUsers()
      .then((data) => {
        res.status(200).send({
          message: "All users fetch success!",
          data: data,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "All users fetch failed!",
          error: error,
        });
      });
  }

  // delete existing user
  //  admin only
  async deleteUser(req: Request, res: Response): Promise<void> {
    this.serviceInstance
      .removeUser(req.params.userID as string)
      .then((_data) => {
        res.status(200).send({
          message: "user deletion success!",
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "user deletion failed!",
          error: error,
        });
      });
  }

  async findUid(uid: string): Promise<userDTO> {
    try {
      const user = await this.serviceInstance.getByUid(uid);
      return user;
    } catch (error) {
      throw new Error("user not found");
    }
  }

  // get user by id
  // admin only
  async getUserByID(req: Request, res: Response): Promise<void> {
    const uid = req.params.uid;
    this.findUid(uid)
      .then((_data) => {
        res.status(200).send({
          message: "user details fetch success!",
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "user details fetch failed!",
          error: error,
        });
      });
  }

  // login user
  async loginUser(req: Request, res: Response): Promise<void> {
    const { uid, IDtoken } = req.body;
    const user = await this.findUid(uid)
      .then(async (_data) => {
        try {
          // update the RFtoken
          res.status(200).send({
            message: "user login success!",
          });
        } catch (error) {
          res.status(500).send({
            message: "user login failed!",
            error: error,
          });
        }
      })
      .catch((_error) => {
        // create new user if not found
        this.createUser(req, res);
      });
  }
}

export default UserController;
