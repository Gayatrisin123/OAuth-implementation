import axios from 'axios';
import jwt from 'jsonwebtoken';
import { oauth2Client } from '../utils/googleClient.js';
import User from '../models/google.modal.js';

export const googleAuth = async (req, res, next) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        const { access_token } = googleRes.tokens;

        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
        );
        const { email, name, picture } = userRes.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
                accessToken: access_token,
            });
        } else {
            user.accessToken = access_token;
            await user.save();
        }

        const { _id } = user;
        const token = jwt.sign(
            { _id, email },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT,
            }
        );

        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
