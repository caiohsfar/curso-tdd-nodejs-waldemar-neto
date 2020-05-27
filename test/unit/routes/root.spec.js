import RootController from '../../../src/controllers/root'
import sinon from 'sinon'
import { name, version, description } from '../../../package.json'

describe('Controllers: Root', () => {
    describe('index()', () => {
        describe('when acess root app', () => {
            it('should return 200 as status code', () => {
                const appInfo = { name, version, description }
                const request = {}
                const response = {
                    status: sinon.stub(),
                    send: sinon.stub()
                }

                response.status.withArgs(200).returns(response)

                const rootController = new RootController()
                rootController.index(request, response)

                sinon.assert.calledWith(response.send, appInfo)

            })
        })

    })

})
