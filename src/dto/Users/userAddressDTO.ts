/* eslint-disable max-params */
export class userAddressDTO {
  uid: string;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mobile?: number;
  defaultAddress?: boolean;
  pref?: string;

  constructor(
    uid: string,
    name?: string,
    street?: string,
    city?: string,
    state?: string,
    pincode?: string,
    mobile?: number,
    defaultAddress?: boolean,
    pref?: string,
  ) {
    this.uid = uid;
    this.name = name;
    this.street = street;
    this.city = city;
    this.state = state;
    this.pincode = pincode;
    this.mobile = mobile;
    this.defaultAddress = defaultAddress;
    this.pref = pref;
  }
}
