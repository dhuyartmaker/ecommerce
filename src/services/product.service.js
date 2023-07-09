const { BadRequestError, NotFoundError } = require("../core/error.response");
const { productModel, electronicModel, clothingModel, productType } = require("../models/product.model");
const { findAllDraft, findAllProduct, updateProductById } = require("../models/product/product.repo");

class ProductFactory {
    static classStaticFactory = {}

    static signClass(type, refClass) {
        ProductFactory.classStaticFactory[type] = refClass;
    }

    async createProduct(type, payload) {
        const newProduct = new ProductFactory.classStaticFactory[type](payload);
        return await newProduct.createProduct()
    }

    async updatePatchProduct(id, payload) {
        const findProduct = await productModel.findById(id);
        console.log("==findProduct==", findProduct)
        if (!findProduct) throw new NotFoundError("Not found product!")

        const newProduct = new ProductFactory.classStaticFactory[findProduct.product_type](findProduct);
        if (payload.product_attributes) {
            payload.product_attributes = {
                ...findProduct.product_attributes,
                ...payload.product_attributes
            }
        }
        return await newProduct.updateProduct({ productId: id, payload })
    }

    async getAllDraft() {
        return await findAllDraft({});
    }

    async getAllProduct({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublic: true }
    }) {
        return await findAllProduct({
            limit, sort, page, filter,
            select: ['product_name', 'product_thumb', 'product_price']
        })
    }
}

class Product {
    constructor ({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes;
    }

    async createProduct() {
        console.log("===this===", { ...this })
        return await productModel.create({ ...this });
    }

    async updateProduct({ productId, payload }) {
        return await updateProductById({ productId, payload })
    }
}

class Electronic extends Product {
    constructor(payload) {
        super(payload)
        this.product_type = productType.Electronic
    }

    async createProduct() {
        const product = await super.createProduct();
        if (!product) throw new BadRequestError()
        return await electronicModel.create({ ...this.product_attributes, _id: product._id })
    }

    async updateProduct({ productId, payload }) {
        if (payload.product_attributes) {
            await electronicModel.findByIdAndUpdate(productId, { ...payload.product_attributes })
        }
        return await super.updateProduct({ productId, payload })
    }
}

class Clothing extends Product {
    constructor(payload) {
        super(payload)
        this.product_type = productType.Clothing
    }

    async createProduct() {
        const product = await super.createProduct();
        if (!product) throw new BadRequestError()
        return await clothingModel.create({ ...this.product_attributes, _id: product._id })
    }

    async updateProduct({ productId, payload }) {
        if (payload.product_attributes) {
            await clothingModel.findByIdAndUpdate(productId, { ...payload.product_attributes })
        }
        return await super.updateProduct({ productId, payload })
    }
}

ProductFactory.signClass(productType.Electronic, Electronic)
ProductFactory.signClass(productType.Clothing, Clothing)

module.exports = {
    ProductFactory: new ProductFactory()
}