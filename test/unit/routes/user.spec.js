import sinon from 'sinon'
import UsersController from '../../../src/controllers/users'
import UserEntity from '../../../src/models/user'


describe('Controllers: Users', () => {
    const defaultRequest = {
        params: {}
    }
    const defaultUser = [{
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
        name: 'Default User',
        email: 'user@mail.com',
        password: 'password',
        role: 'user'
    }]

    describe('get() users', () => {
        it('should return a list of products', async () => {
            const response = {
                send: jest.fn()
            }
            UserEntity.find = sinon.stub()
            UserEntity.find.withArgs({}).resolves(defaultUser)

            const usersController = new UsersController(UserEntity)
            await usersController.get(defaultRequest, response)

            expect(response.send).toBeCalledWith(defaultUser)
        })

        it('should return 500 as status code when an error occours', async () => {
            const response = {
                status: sinon.stub(),
                send: jest.fn()
            }
            response.status.withArgs(500).returns(response)

            UserEntity.find = sinon.stub()
            UserEntity.find.withArgs({}).rejects(new Error('Server Error'))


            const usersController = new UsersController(UserEntity)
            await usersController.get(defaultRequest, response)

            sinon.assert.calledWith(response.status, 500)
            expect(response.send).toBeCalledWith(new Error('Server Error'))
        })
    })
    describe('getById()', () => {
        it('should return a user when passing an id', async () => {
            const fakeId = 'a-fake-id'
            const request = {
                params: {
                    id: fakeId
                }
            }
            const response = {
                send: jest.fn()
            }
            class FakeUser {
                static findById() { }
            }
            const findByIdStub = sinon.stub(FakeUser, 'findById')

            findByIdStub.withArgs({ _id: fakeId }).resolves(defaultUser)

            const usersController = new UsersController(FakeUser)
            await usersController.getById(request, response)

            expect(response.send).toBeCalledWith(defaultUser)
        })
    })
})
