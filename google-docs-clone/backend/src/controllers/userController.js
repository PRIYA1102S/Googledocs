class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async registerUser(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const { token, user } = await this.userService.loginUser({ email, password });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

    async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UserController;