export interface AddressModelServer{
    id: number,
    fullname: string,
    line1: string,
    line2: string,
    city: string,
    state: string,
    country: string,
    phone: string,
    pincode: number
}

export interface AddressServerResponse{
    addresses : AddressModelServer[];
}

export interface AddressSetModelServer{
    user_id: number,
    fullname: string,
    line1: string,
    line2: string,
    city: string,
    state: string,
    country: string,
    phone: string,
    pincode: number
}