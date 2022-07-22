import RepositoryInterface from "./repository-interface";
import Product from "../entity/Product";

export default interface ProductRepositoryInterface extends RepositoryInterface<Product>{
    findByName(name: string)
}