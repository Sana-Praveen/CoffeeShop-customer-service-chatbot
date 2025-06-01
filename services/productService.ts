import {firebaseDB} from "@/config/firebaseConfigi";
import {ref,get} from 'firebase/database';
import { Product } from "@/types/types";

const productRef = ref(firebaseDB,'products');

const fetchProducts = async (): Promise<Product[]> => {
    const snapshot = await get(productRef);
    const data = snapshot.val();

    const products: Product[] = []
    if(data){
        for(const Key in data){
            if(data.hasOwnProperty(Key)){
                products.push({... data[Key]});
            }
        }
    }
    return products;
}

export {fetchProducts}