import ProductsController from '../../../src/controllers/products'
import sinon, { stub } from 'sinon'
import Product from '../../../src/models/product'

// Cria um fake da classe product para simular unitariamente se a função save está sendo chamada
const makeFakeProduct = () => {
    class FakeProduct {
        save() { }
        static findOne() { }
        static updateOne() { }
        static deleteOne() { }
    }

    return FakeProduct
}

describe('Controllers: Products', () => {
    const defaultProduct = [{
        name: 'Default product',
        description: 'product description',
        price: 100
    }]
    const defaultRequest = {
        params: {}
    }

    describe('get() products', () => {
        it('should return a list of products', async () => {
            const response = {
                send: sinon.spy(),
            }
            Product.find = sinon.stub() 
            //Colocando um retorno fake no stub (mudando o comportamento)
            Product.find.withArgs({}).resolves(defaultProduct)

            const productsController = new ProductsController(Product);
            await productsController.get(defaultRequest, response)

            //Verificando se o Product.find foi chamado dentro do controller
            expect(Product.find.calledWith({})).toBeTruthy()

            //Verificando se o spy {send} foi chamado com o retorno fake do stub
            sinon.assert.calledWith(response.send, defaultProduct)
        })
        it('shoult return 500 when an error occours', async () => {
            const request = {}
            const response = {
                send: sinon.spy(),
                status: sinon.stub()
            }
            response.status.withArgs(500).returns(response)
            Product.find = sinon.stub()
            //TODO:create errors
            Product.find.withArgs({}).rejects(new Error('Internal Error'))

            const productsController = new ProductsController(Product)
            await productsController.get(request, response)

            expect(response.send.calledWith(sinon.match.has("message", "Internal Error"))).toBeTruthy()
        })
    })

    describe('getById()', () => {
        it('should return one product', async () => {
            const fakeId = 'a-fake-id'
            const request = {
                params: {
                    id: fakeId
                }
            }
            const response = {
                send: sinon.spy(),
            }

            Product.find = sinon.stub()
            Product.find.withArgs({ _id: fakeId }).resolves(defaultProduct)

            const productsController = new ProductsController(Product)
            await productsController.getById(request, response)

            sinon.assert.calledWith(response.send, defaultProduct);
        })
        describe('when receive an error', () => {
            it('should return 500 as status code', async () => {
                const fakeId = 'a-fake-id'
                const request = {
                    params: {
                        id: fakeId
                    }
                }
                const response = {
                    send: sinon.spy(),
                    status: sinon.stub()
                }

                response.status.withArgs(500).returns(response)

                Product.find = sinon.stub()
                Product.find.withArgs({ _id: fakeId }).rejects(new Error('Server Error'))

                const productsController = new ProductsController(Product)
                await productsController.getById(request, response)

                sinon.assert.calledWith(response.send, sinon.match.has('message', 'Internal Error'));
                sinon.assert.calledWith(response.status, 500)
            })
        })

    })

    describe('create()', () => {
        it('should save a new product successfully', async () => {
            const FakeProduct = makeFakeProduct()
            const requestWithBody = Object.assign(
                {},
                { body: defaultProduct[0] },
                defaultRequest
            );
            const response = {
                send: sinon.spy(),
                status: stub()
            }
            response.status.withArgs(201).returns(response)

            sinon
                .stub(FakeProduct.prototype, 'save')
                .withArgs()
                .resolves()

            const productsController = new ProductsController(FakeProduct)
            await productsController.create(requestWithBody, response)

            sinon.assert.calledWith(response.send)
            sinon.assert.calledWith(response.status, 201)
        })

        describe('when an error occours', () => {
            it('should return 422', async () => {
                const FakeProduct = makeFakeProduct()

                const response = {
                    send: sinon.spy(),
                    status: stub()
                }
                response.status.withArgs(422).returns(response)

                sinon
                    .stub(FakeProduct.prototype, 'save')
                    .withArgs()
                    .rejects(new Error('Unprocessable Entity'))

                const productsController = new ProductsController(FakeProduct)
                await productsController.create(defaultRequest, response)

                sinon.assert.calledWith(response.status, 422)
                sinon.assert.calledWith(response.send, sinon.match.has("message", "Unprocessable Entity"))
            })
        })

    })

    describe('Update()', () => {
        it('should return 204 as status code if update successfully', async () => {
            const fakeId = 'a-fake-id'
            const FakeProduct = makeFakeProduct()
            const updatedProduct = {
                _id: fakeId,
                description: 'updated description',
                price: 150
            }
            const request = {
                params: {
                    id: fakeId,
                },
                body: updatedProduct
            }
            const response = {
                sendStatus: sinon.spy()
            }

            const updateOneStub = sinon.stub(FakeProduct, 'updateOne')
            updateOneStub.withArgs({ _id: fakeId }, updatedProduct).resolves(updatedProduct)

            const productController = new ProductsController(FakeProduct)
            await productController.update(request, response)

            sinon.assert.calledWith(response.sendStatus, 204)
        })

        it('should return 422 when error occours', async () => {
            const fakeId = 'a-fake-id'
            const FakeProduct = makeFakeProduct()
            const updatedProduct = {
                _id: fakeId,
                description: 'updated description',
                price: 150
            }
            const request = {
                params: {
                    id: fakeId,
                },
                body: updatedProduct
            }
            const response = {
                status: sinon.stub(),
                send: sinon.spy()
            }

            response.status.withArgs(422).returns(response)

            const updateOneStub = sinon.stub(FakeProduct, 'updateOne')
            updateOneStub.withArgs({ _id: fakeId }, updatedProduct).rejects(new Error('Unprocessable Entity'))

            const productController = new ProductsController(FakeProduct)
            await productController.update(request, response)

            sinon.assert.calledWith(response.status, 422)
            sinon.assert.calledWith(response.send, sinon.match.has('message', 'Unprocessable Entity'))
        })
    })

    describe('remove()', () => {
        describe('when delete a product', () => {
            it('should return 204 as status code', async () => {
                const FakeProduct = makeFakeProduct()
                const fakeId = 'a-fake-id'
                const request = {
                    params: {
                        id: fakeId
                    }
                }
                const response = {
                    send: sinon.spy(),
                    status: sinon.stub()
                }

                response.status.withArgs(204).returns(response)

                const deleteOneStub = sinon.stub(FakeProduct, 'deleteOne')
                deleteOneStub.withArgs({ _id: fakeId }).resolves()

                const productsController = new ProductsController(FakeProduct)
                await productsController.remove(request, response)

                sinon.assert.calledWith(response.status, 204)
            })
        })

        describe('when receive an error', () => {
            it('should return 500 as status code', async () => {
                const FakeProduct = makeFakeProduct()
                const fakeId = 'a-fake-id'
                const request = {
                    params: {
                        id: fakeId
                    }
                }

                const response = {
                    send: sinon.spy(),
                    status: sinon.stub()
                }

                response.status.withArgs(500).returns(response)

                const deleteOneStub = sinon.stub(FakeProduct, 'deleteOne')
                deleteOneStub.withArgs({ _id: fakeId }).rejects(new Error('Server Error'))

                const productsController = new ProductsController(FakeProduct)
                await productsController.remove(request, response)

                sinon.assert.calledWith(response.status, 500)
                sinon.assert.calledWith(response.send, sinon.match.has('message', 'Server Error'))
            })
        })
    })
})
