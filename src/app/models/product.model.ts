export interface ProductModelServer {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    images: string;
}

export interface ServerResponse {
    count: number;
    products: ProductModelServer[];
}

export interface ProductSearchModel {
    id: number;
    image: string;
    name: string;
    description: string;
    price: string;
    cat_id: number;
}

export interface MessageResponse {
    message: string;
}

export interface ProductOrderUserModel {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    username: string;
}