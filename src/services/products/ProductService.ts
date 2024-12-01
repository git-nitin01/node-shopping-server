/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductDTO, ProductInputDTO } from "../../dto/products/ProductDTO";
import { Product } from "../../models/mongodb/products.model";

class ProductService {
  constructor() {}

  // CREATE a new product
  public async createProduct(
    productInput: ProductInputDTO,
  ): Promise<ProductDTO> {
    const newProduct = new Product(productInput);
    const savedProduct = await newProduct.save();
    return this.mapProductToDTO(savedProduct);
  }

  // UPDATE an existing product
  public async updateProduct(
    productId: string,
    productInput: ProductInputDTO,
  ): Promise<ProductDTO | null> {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productInput,
      { new: true },
    );
    return updatedProduct ? this.mapProductToDTO(updatedProduct) : null;
  }

  // DELETE a product
  public async deleteProduct(productId: string): Promise<void> {
    await Product.findByIdAndDelete(productId);
  }

  // GET a product by ID
  public async getProductById(productId: string): Promise<ProductDTO | null> {
    const product = await Product.findById(productId);
    return product ? this.mapProductToDTO(product) : null;
  }

  // GET ALL products
  public async getAllProducts(): Promise<ProductDTO[]> {
    const products = await Product.find();
    return products.map(this.mapProductToDTO);
  }

  // GET similar products
  public async getSimilarProducts(
    category: string,
    excludeProductId: string,
  ): Promise<ProductDTO[]> {
    const similarProducts = await Product.find({
      category,
      _id: { $ne: excludeProductId }, // Exclude the current product
    });
    return similarProducts.map(this.mapProductToDTO);
  }

  // Utility function to map Product model to ProductDTO
  private mapProductToDTO(product: any): ProductDTO {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      categoryId: product.categoryId?.toString() || "",
      category: product.category,
      isPopular: product.isPopular,
      ratingCount: product.ratingCount,
      averageRating: product.averageRating,
      sizes: product.sizes.map((size: any) => ({
        size: size.size,
        price: size.price,
        images: size.images,
        inStock: size.inStock,
        isPopular: size.isPopular,
        subTitle: size.subTitle,
        discountPercentage: size.discountPercentage,
      })),
    };
  }
}

export default ProductService;
