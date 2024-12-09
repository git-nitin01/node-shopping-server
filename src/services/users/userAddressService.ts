/* eslint-disable prettier/prettier */
import { plainToClass } from "class-transformer";
import userAddress from "../../models/mongodb/userModels/userAddress.model";
import { userAddressDTO } from "../../dto/Users/userAddressDTO";

class UserAddressService {
  private static instance: UserAddressService;

  private constructor() {}

  static getServiceInstance() {
    if (!UserAddressService.instance) {
      UserAddressService.instance = new UserAddressService();
    }
    return UserAddressService.instance;
  }

  // create user address service
  async createAddress(resource: any): Promise<userAddressDTO> {
    // save document in address collection
    try {
      // check if address already exists
      const existingDoc = await userAddress.findOne({
        uid: { $eq: resource.uid },
        street: resource.street,
        pincode: resource.pincode,
      });
      if (existingDoc) {
        throw new Error("Address already exists");
      }
      const document = new userAddress(resource);
      const savedDocument = await document.save();
      return plainToClass(userAddress, savedDocument.toObject());
    } catch (err) {
      throw new Error(`403-${err}`);
    }
  }

  // get user address service
  async getAddressEntry(uid: string): Promise<userAddressDTO[]> {
    const addressDocs = await userAddress.find({ uid: { $eq: uid } });
    if (!addressDocs) {
      throw new Error("404 unavailable");
    }
    return addressDocs.map((doc) => plainToClass(userAddress, doc.toObject()));
  }

  // delete entry
  async deleteEntry(userId: string, dataId: string): Promise<boolean> {
    const deletionResult = await userAddress.deleteOne({
      uid: { $eq: userId },
      _id: { $eq: dataId },
    });
    if (deletionResult.deletedCount === 1) {
      return true;
    } else {
      throw new Error("404 unavailable");
    }
  }

  // update entry
  async updateEntry(resource: any): Promise<userAddressDTO> {
    const document = await userAddress.findOne({
      uid: { $eq: resource.uid },
      _id: { $eq: resource._id },
    });
    if (!document) {
      throw new Error("404 unavailable");
    }
    document.set(resource);
    if (resource.defaultAddress) {
      await userAddress.updateMany(
        { uid: { $eq: resource.uid } },
        { defaultAddress: false },
      );
    }
    const updatedDocument = await document.save();
    return plainToClass(userAddress, updatedDocument.toObject());
  }
}

export default UserAddressService;
