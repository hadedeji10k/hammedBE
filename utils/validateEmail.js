const User = require("../models/user")

module.exports = async (email) => {
    let user = await User.findOne({ email });
    if (user) {
        return true;
    } else {
        return false;
    }
}
