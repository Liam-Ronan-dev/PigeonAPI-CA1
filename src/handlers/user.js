import { User } from '../models/user.js';
import { hashPassword, createJWT, comparePassword } from '../modules/auth.js';

/**
 * Create user function
 */
export const createUser = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    const hashedPassword = await hashPassword(req.body.password);

    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const token = createJWT(user);
    await user.save();

    res
      .status(201)
      .json({ token, message: `${user.username} has been created` });
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
};

/**
 * Signin user function
 */
export const singIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createJWT(user);
    res.status(200).json({ token, message: `${user.username} has signed in!` });
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err}` });
  }
};
