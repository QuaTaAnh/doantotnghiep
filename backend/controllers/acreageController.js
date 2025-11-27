import { getAcreageService } from "../services/acreageService"

export const getAcreageController = async (req, res) =>{
    try {
       const acreage = await getAcreageService()
       return res.status(200).json(acreage)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false, 
            message: 'Có lỗi xảy ra!', 
            error
        })
    }
}