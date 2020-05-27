import sinon, { stub } from 'sinon'
import setupApp from '../../../src/app'
import supertest from 'supertest'

describe('Routes: Root', () => {
    let request
    let app

    beforeAll(async () => {
        app = await setupApp()
        request = supertest(app)
    })

    describe('GET /', () => {
        const { version, name, description } = require('../../../package.json')

        it('should return apps name, version and description info', async (done) => {
            request
                .get('/')
                .end((err, res) => {
                    expect(res.body).toEqual({ version, name, description })
                    done(err)
                })
        })
    })

})
