const userModel = require("../models/userModel");

module.exports.esmFonction = async (req, res) => {
  try {
    //logique

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    //logique
    const usersList = await userModel.find().populate("cars");
    res.status(200).json({ usersList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    const user = await userModel.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAuthUser = async (req, res) => {
  try {  
    const user = await userModel.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.getUserByAge = async (req, res) => {
  try {
    //logique
    const age = req.params.age;
    const user = await userModel
      .find({ age: { $gte: age } })
      .sort({ age: -1 })
      .limit(2);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserBetweenAgeXAndY = async (req, res) => {
  try {
    //logique
    const minAge = req.body.minAge;
    const maxAge = req.body.maxAge;

    if (isNaN(minAge) || isNaN(maxAge)) {
      throw new Error("minAge is null");
    }

    if (minAge > maxAge) {
      throw new Error("minAge < maxAge");
    }

    const user = await userModel
      .find({ age: { $lte: maxAge, $gte: minAge } })
      .sort({ age: 1 });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClient = async (req, res) => {
  try {
    //logique
    const { firstName, lastName, email, password, age } = req.body;
    const role = "client";

    const user = new userModel({
      firstName,
      lastName,
      email,
      password,
      age,
      role,
    });
    const addedUser = await user.save();
    res.status(200).json({ addedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsersSortedByFirstName = async (req, res) => {
  try {
    //logique
    const usersList = await userModel.find().sort({ firstName: -1 });
    const count = usersList.length;
    res.status(200).json({ count, usersList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.searchUsersByFirstName = async (req, res) => {
  // ?name=John
  try {
    const { firstName } = req.body;

    if (!firstName) {
      throw new Error("Please select a name");
    }

    const userList = await userModel.find({
      firstName: { $regex: firstName, $options: "i" }, // Debut
      //firstName: {$regex : `${firstName}$` , $options: "i" } Fin
    });

    if (userList.length === 0) {
      throw new Error("Aucune Utilisateur trouve pour ce nom");
    }

    res.status(200).json({ userList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteUserById = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClientV2 = async (req, res) => {
  try {
    //logique
    const userData = req.body;
    userData.role = "client";

    const user = new userModel(userData);
    const addedUser = await user.save();
    res.status(200).json({ addedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClientWithImage = async (req, res) => {
  try {
    //logique
    const userData = req.body;
    userData.role = "client";

    if (req.file) {
      const { filename } = req.file;
      userData.user_Image = filename;
    }

    const user = new userModel(userData);
    const addedUser = await user.save();
    res.status(200).json({ addedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; //get d id from params
    const { firstName, lastName, age, email } = req.body;

    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("uesr not found !");
    }

    updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: { firstName, lastName, age, email },
    });

    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const carModel = require("../models/carModel");

module.exports.deleteUserByIdandRelation = async (req, res) => {
  try {
    //logique
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);

    await carModel.updateMany({ owner: id }, { $unset: { owner: "" } });

    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const jwt = require("jsonwebtoken");
const maxAge = 1 * 60; //1min

const createToken = (id) => {
  return jwt.sign({ id }, "net sousse secret", { expiresIn: maxAge });
};

module.exports.login = async (req, res) => {
  try {
    //logique
    const { email, password } = req.body;
    const user = await userModel.login(email, password);

    const token = createToken(user._id);
    res.cookie("tokenJwt", token, { httpOnly: false, maxAge: maxAge * 1000 });

    res
      .status(200)
      .json({ message: "User successfully authenticated", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    //logique

    res.cookie("tokenJwt", "", { httpOnly: false, maxAge: 1 });

    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
