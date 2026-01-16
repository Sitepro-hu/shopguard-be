const Product = require("../models/product.model");
const ProductGallery = require("../models/product-gallery.model");
const ProductDownloadable = require("../models/product-downloadable.model");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const { ProductErrors } = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const {
  customSlugify,
} = require("../../shared/database-helpers/slugify-helper");

class ProductService {
  async createProduct(productData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (!productData.slug || productData.slug.trim() === "") {
      productData.slug = await customSlugify(Product, productData.title, null);
    }

    // Külön kezeljük a gallery és downloadable adatokat
    const { gallery, downloadables, ...productFields } = productData;

    const product = await Product.create(productFields);

    // Ha van gallery, hozzáadjuk
    if (gallery && Array.isArray(gallery)) {
      const galleryItems = gallery.map((item) => ({
        ...item,
        productId: product.id,
      }));
      await ProductGallery.bulkCreate(galleryItems);
    }

    // Ha van downloadable, hozzáadjuk
    if (downloadables && Array.isArray(downloadables)) {
      const downloadableItems = downloadables.map((item) => ({
        ...item,
        productId: product.id,
      }));
      await ProductDownloadable.bulkCreate(downloadableItems);
    }

    return await this.getProductById(product.id);
  }

  async getAllProducts() {
    return await Product.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ProductGallery,
          as: "gallery",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ProductDownloadable,
          as: "downloadables",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
    });
  }

  async getProductById(id, includeAdjacent = false) {
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductGallery,
          as: "gallery",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ProductDownloadable,
          as: "downloadables",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ProductSubcategory,
          as: "subcategory",
          required: false,
          include: [
            {
              model: ProductCategory,
              as: "category",
              required: false,
            },
          ],
        },
      ],
    });

    if (!product) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Product,
          orderBy: "createdAt",
        });

        return {
          ...product.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a product-t adjuk vissza
        return product;
      }
    }

    return product;
  }

  async getProductBySlug(slug) {
    const product = await Product.findOne({ 
      where: { 
        slug,
        status: "PUBLISHED"
      },
      include: [
        {
          model: ProductGallery,
          as: "gallery",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ProductDownloadable,
          as: "downloadables",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ProductSubcategory,
          as: "subcategory",
          required: false,
          include: [
            {
              model: ProductCategory,
              as: "category",
              required: false,
            },
          ],
        },
      ],
    });

    return product;
  }

  async updateProduct(id, productData) {
    const product = await Product.findOne({
      where: { id },
    });

    if (!product) {
      throw ProductErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!productData.slug || productData.slug.trim() === "") &&
      productData.title
    ) {
      productData.slug = await customSlugify(Product, productData.title, id);
    }

    // Külön kezeljük a gallery és downloadable adatokat
    const { gallery, downloadables, ...productFields } = productData;

    await product.update(productFields);

    // Ha van gallery, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (gallery !== undefined) {
      await ProductGallery.destroy({ where: { productId: id } });
      if (Array.isArray(gallery) && gallery.length > 0) {
        const galleryItems = gallery.map((item) => ({
          ...item,
          productId: id,
        }));
        await ProductGallery.bulkCreate(galleryItems);
      }
    }

    // Ha van downloadable, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (downloadables !== undefined) {
      await ProductDownloadable.destroy({ where: { productId: id } });
      if (Array.isArray(downloadables) && downloadables.length > 0) {
        const downloadableItems = downloadables.map((item) => ({
          ...item,
          productId: id,
        }));
        await ProductDownloadable.bulkCreate(downloadableItems);
      }
    }

    return await this.getProductById(id);
  }

  async deleteProduct(id) {
    const product = await Product.findOne({
      where: { id },
    });

    if (!product) {
      throw ProductErrors.notFound();
    }

    await product.destroy();

    return true;
  }

  async queryProducts({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Product,
      pagination,
      sort,
      search,
      filters,
      include: [
        {
          model: ProductGallery,
          as: "gallery",
          required: false,
        },
        {
          model: ProductDownloadable,
          as: "downloadables",
          required: false,
        },
      ],
    });

    return result;
  }

  async updateProductStatus(ids, status) {
    await Product.update({ status }, { where: { id: ids } });

    const updatedProducts = await Product.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: ProductGallery,
          as: "gallery",
          required: false,
        },
        {
          model: ProductDownloadable,
          as: "downloadables",
          required: false,
        },
      ],
    });

    return updatedProducts;
  }
}

module.exports = new ProductService();
