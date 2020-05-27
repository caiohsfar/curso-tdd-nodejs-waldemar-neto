export default class UsersController {
    constructor(User) {
        this.User = User
    }

    async get(req, res) {
        try {
            const users = await this.User.find({})
            res.send(users)
        } catch (error) {
            res.status(500).send(new Error('Server Error'))
        }

    }

    async getById(req, res) {
        const { params: { id } } = req
        try {
            const user = await this.User.findById({ _id: id })
            res.send(user)
        } catch (error) {
            res.status(500).send(new Error('Server Error'))
        }

    }
}