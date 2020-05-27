import setupApp from '../../../src/app'
import supertest from 'supertest'
import Product from '../../../src/models/product'

describe('Routes: Products', () => {
    const defaultId = '56cb91bdc3464f14678934ca'

    const defaultProduct = {
        name: 'Default product',
        description: 'product description',
        price: 100
    }
    const expectedProduct = {
        __v: 0,
        _id: defaultId,
        name: 'Default product',
        description: 'product description',
        price: 100
    };

    let request
    let app
    beforeAll(async () => {
        app = await setupApp()
        request = supertest(app)
    })
    afterAll(async () => {
        await app.database.connection.close()
    })

    beforeEach(async () => {
        await Product.deleteMany()

        const product = new Product(defaultProduct)
        product._id = defaultId

        return await product.save()
    })

    afterEach(async () => {
        await Product.deleteMany()
    })

    describe('GET /products', () => {
        it('should return a list of products', done => {
            request
                .get('/products')
                .end((err, res) => {
                    expect(res.body).toEqual([expectedProduct])
                    done(err)
                })
        })

        describe('when an id is specified', () => {
            it('should return 200 with one product', (done) => {
                request
                    .get(`/products/${defaultId}`)
                    .end((err, res) => {
                        expect(res.statusCode).toEqual(200)
                        expect(res.body).toEqual([expectedProduct])
                        done(err)
                    })
            })
        })
    })



    describe('POST /products', () => {
        describe('when posting a product', () => {
            it('should return a new product with status code 201', (done) => {
                const customId = '56cb91bdc3464f14678934ba'
                const newProduct = Object.assign({}, { _id: customId, __v: 0 }, defaultProduct)

                const expectedSavedProduct = {
                    __v: 0,
                    _id: customId,
                    name: 'Default product',
                    description: 'product description',
                    price: 100
                };

                request
                    .post('/products')
                    .send(newProduct)
                    .end((err, res) => {
                        expect(res.statusCode).toEqual(201)
                        expect(res.body).toEqual(expectedSavedProduct)
                        done(err)
                    })
            })
        })

    })

    describe('PUT /products/:id', () => {
        describe('when editing a product', () => {
            it('should update the product and return 204 as status code', (done) => {
                const customProduct = {
                    name: "Custom name"
                }
                const updatedProduct = Object.assign({}, customProduct, defaultProduct)

                request
                    .put(`/products/${defaultId}`)
                    .send(updatedProduct)
                    .end((err, res) => {
                        expect(res.status).toEqual(204)
                        done(err)
                    })
            })
        })
    })

    describe('DELETE /products/:id', () => {
        describe('when delete a product', () => {
            it('should return 204 (no content) as status code', (done) => {
                request
                    .delete(`/products/${defaultId}`)
                    .end((err, res) => {
                        expect(res.statusCode).toEqual(204)
                        done(err)
                    })
            })
        })
        
    })
    



})