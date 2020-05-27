export default class ProductsController {
    constructor(Product) {
        this.Product = Product
    }
    async get(req, res) {
        try {
            const products = await this.Product.find({})
            res.send(products)
        }
        catch (error) {
            //console.error(error)
            res.status(500).send(new Error("Internal Error"))
        }

    }

    async getById(req, res) {
        const { params: { id } } = req
        try {
            const products = await this.Product.find({ _id: id })
            res.send(products)
        }
        catch (error) {
            //console.error(error)
            res.status(500).send(new Error("Internal Error"))
        }
    }

    async create(req, res) {
        try {
            const productRepository = new this.Product(req.body)
            const savedProduct = await productRepository.save()
            res.status(201).send(savedProduct)
        }
        catch (error) {
            //console.error(error)
            res.status(422).send(new Error("Unprocessable Entity"))
        }
    }

    async update(req, res) {
        const { params: { id }, body } = req
        try {
            await this.Product.updateOne({ _id: id }, body)
            res.sendStatus(204)
        } catch (error) {
            //console.error(error)
            res.status(422).send(new Error('Unprocessable Entity'))
        }
    }

    async remove(req, res) {
        const { params: { id } } = req
        try {
            await this.Product.deleteOne({ _id: id })
            res.status(204).send()
        }
        catch (error) {
            //console.error(error)
            res.status(500).send(new Error('Server Error'))
        }
    }


}