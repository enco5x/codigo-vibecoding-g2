import { usersService } from "./users.service.js";

export const usersController = {
  async register(req, res) {
    try {
      const { name, lastname, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      if (!lastname) {
        return res.status(400).json({ error: "Lastname is required" });
      }
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const user = await usersService.create({ name, lastname, email, password });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.message.includes("required") || error.message.includes("characters") || error.message.includes("registered") || error.message.includes("format")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const user = await usersService.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await usersService.validatePassword(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const userWithToken = await usersService.updateToken(user.id);

      res.json({
        token: userWithToken.token,
        user: {
          id: userWithToken.id,
          name: userWithToken.name,
          email: userWithToken.email
        }
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};