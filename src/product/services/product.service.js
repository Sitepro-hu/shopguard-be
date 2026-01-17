const Product = require("../models/product.model");
const ProductGallery = require("../models/product-gallery.model");
const ProductDownloadable = require("../models/product-downloadable.model");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const Reference = require("../../reference/models/reference.model");
const Country = require("../../reference/models/country.model");
const ReferenceResult = require("../../reference/models/reference-result.model");
const ReferenceTestimonial = require("../../reference/models/reference-testimonial.model");
const Media = require("../../media/models/media.model");
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

    // Külön kezeljük a gallery, downloadable, references és media adatokat
    const { gallery, downloadables, references, media, ...productFields } = productData;

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

    // Ha van references, hozzáadjuk (many-to-many)
    if (references && Array.isArray(references) && references.length > 0) {
      await product.setReferences(references);
    }

    // Ha van media, hozzáadjuk (many-to-many)
    if (media && Array.isArray(media) && media.length > 0) {
      await product.setMedia(media);
    }

    return await this.getProductById(product.id);
  }

  async getAllProducts() {
    const products = await Product.findAll({
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
        {
          model: Reference,
          as: "references",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a referenceId-kat és mediaId-kat adjuk vissza tömbben
    return products.map((product) => {
      const productJson = product.toJSON();
      productJson.referenceIds = productJson.references
        ? productJson.references.map((ref) => ref.id)
        : [];
      productJson.mediaIds = productJson.media
        ? productJson.media.map((m) => m.id)
        : [];
      delete productJson.references;
      delete productJson.media;
      return productJson;
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
        {
          model: Reference,
          as: "references",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    if (!product) {
      return null;
    }

    // Admin esetén csak a referenceId-kat és mediaId-kat adjuk vissza tömbben
    const productJson = product.toJSON();
    productJson.referenceIds = productJson.references
      ? productJson.references.map((ref) => ref.id)
      : [];
    productJson.mediaIds = productJson.media
      ? productJson.media.map((m) => m.id)
      : [];
    delete productJson.references;
    delete productJson.media;

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Product,
          orderBy: "createdAt",
        });

        return {
          ...productJson,
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a product-t adjuk vissza
        return productJson;
      }
    }

    return productJson;
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
        {
          model: Reference,
          as: "references",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
          include: [
            {
              model: Country,
              as: "countries",
              required: false,
              through: { attributes: [] },
            },
            {
              model: ReferenceResult,
              as: "results",
              required: false,
              order: [["displayOrder", "ASC"]],
            },
            {
              model: ReferenceTestimonial,
              as: "testimonials",
              required: false,
              order: [["displayOrder", "ASC"]],
            },
          ],
        },
        {
          model: Media,
          as: "media",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
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

    // Külön kezeljük a gallery, downloadable, references és media adatokat
    const { gallery, downloadables, references, media, ...productFields } = productData;

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

    // Ha van references, frissítjük (many-to-many)
    if (references !== undefined) {
      if (Array.isArray(references) && references.length > 0) {
        await product.setReferences(references);
      } else {
        await product.setReferences([]);
      }
    }

    // Ha van media, frissítjük (many-to-many)
    if (media !== undefined) {
      if (Array.isArray(media) && media.length > 0) {
        await product.setMedia(media);
      } else {
        await product.setMedia([]);
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
        {
          model: Reference,
          as: "references",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a referenceId-kat adjuk vissza tömbben
    if (result.data) {
      result.data = result.data.map((product) => {
        const productJson = product.toJSON ? product.toJSON() : product;
        productJson.referenceIds = productJson.references
          ? productJson.references.map((ref) => ref.id)
          : [];
        delete productJson.references;
        return productJson;
      });
    }

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
        {
          model: Reference,
          as: "references",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a referenceId-kat és mediaId-kat adjuk vissza tömbben
    return updatedProducts.map((product) => {
      const productJson = product.toJSON();
      productJson.referenceIds = productJson.references
        ? productJson.references.map((ref) => ref.id)
        : [];
      productJson.mediaIds = productJson.media
        ? productJson.media.map((m) => m.id)
        : [];
      delete productJson.references;
      delete productJson.media;
      return productJson;
    });
  }
}

module.exports = new ProductService();
