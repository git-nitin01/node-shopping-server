/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from "class-transformer";
import User from "../../models/mongodb/userModels/user.model";
import UserPoints from "../../models/mongodb/userModels/userPoints.model";
import { userPointsDTO } from "../../dto/Users/userPointsDTO";

class UserPointsService {
  private static instance: UserPointsService;

  private constructor() {}

  static getServiceInstance(): UserPointsService {
    if (!UserPointsService.instance) {
      UserPointsService.instance = new UserPointsService();
    }
    return UserPointsService.instance;
  }

  // create new entry
  async createEntry(transact: any): Promise<userPointsDTO> {
    // confirm user existence
    const document = await User.findOne({ uid: transact.userId });
    if (!document) {
      throw new Error("User not found for points entry!");
    } else {
      // user found, creating new entry
      const pointsDetail = new userPointsDTO(
        transact.userId,
        transact.transactionType,
        transact.points,
        transact.userDescription,
        transact?.referralUserId,
        transact?.reason,
      );
      const newEntry = new UserPoints(pointsDetail);
      const savedEntry = await newEntry.save();
      if (!savedEntry) {
        throw new Error("failed to save user point entry!");
      }
      return plainToClass(userPointsDTO, savedEntry.toObject());
    }
  }

  // get user points service
  async getPointsEntry(userId: string): Promise<userPointsDTO> {
    const document = await UserPoints.findOne({ userId });
    if (!document) {
      throw new Error("Unable to find points entry for user!");
    }
    return plainToClass(userPointsDTO, document.toObject());
  }

  // update user points service
  async updatePointsEntry(
    userId: string,
    points: number,
  ): Promise<userPointsDTO> {
    const document = await UserPoints.findOne({ userId });
    if (!document) {
      throw new Error("Unable to find points entry for user!");
    }
    document.updateOne({
      $set: {
        points: points,
      },
    });
    return plainToClass(userPointsDTO, document.toObject());
  }

  // delete entry
  async deleteEntry(userId: string): Promise<boolean> {
    const deletionResult = await UserPoints.deleteOne({ userId });
    if (deletionResult.deletedCount === 1) {
      return true;
    } else {
      throw new Error("user points deletion failed, non-exitent!");
    }
  }
}

export default UserPointsService;
