const sendToken = async (user, statusCode, res) => {
    const token = await user.getJwtToken();
    const options = {
        expiresIn: '1d',
        httpOnly: true,
    };
    res.status(200).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};
module.exports = sendToken;
