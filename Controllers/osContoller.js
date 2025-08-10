const osService = require("../services/osService")

module.exports.getOsInformation = async (req,res) =>{
    try {
        const osInformation = await osService.getData()
        res.status(200).json({osInformation})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}