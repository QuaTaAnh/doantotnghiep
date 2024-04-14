import db from '../models/index.js'
import { v4 } from 'uuid'
import { hashPassword } from '../helpers/authHelper.js'
import nhachothue from '../data/nhachothue.json'
import generateCode from '../utils/generateCode.js'

const dataBody = nhachothue.body

export const insertService = () => new Promise(async (resolve, reject) => {
    try {
        dataBody.forEach(async (item) =>{
            let postId = v4()
            let labelCode = generateCode(4)
            let attributesId = v4()
            let userId = v4()
            let overviewId = v4()
            let imagesId = v4()
            await db.Post.create({
                id: postId,
                title: item?.header?.title,
                star: item?.header?.star,
                labelCode,
                address: item?.header?.address,
                attributesId,
                categoryCode: 'NCT',
                description: JSON.stringify(item?.mainContent?.content),
                userId,
                overviewId,
                imagesId
            })

            await db.Attribute.create({
                id: attributesId,
                price: item?.header?.attributes?.price,
                acreage: item?.header?.attributes?.acreage,
                published: item?.header?.attributes?.published,
                hashtag: item?.header?.attributes?.hashtag,
            })

            await db.Image.create({
                id: imagesId,
                image: JSON.stringify(item?.images)
            })

            await db.Label.create({
                code: labelCode,
                value: item?.header?.class?.classType
            })

            await db.Overview.create({
                id: overviewId,
                code: item?.overview?.content.find(i => i.name === "Mã tin:")?.content,
                area: item?.overview?.content.find(i => i.name === "Khu vực")?.content,
                type: item?.overview?.content.find(i => i.name === "Loại tin rao:")?.content,
                target: item?.overview?.content.find(i => i.name === "Đối tượng thuê:")?.content,
                bonus: item?.overview?.content.find(i => i.name ===  "Gói tin:")?.content,
                created: item?.overview?.content.find(i => i.name ===  "Ngày đăng:")?.content,
                expired: item?.overview?.content.find(i => i.name ===  "Ngày hết hạn:")?.content,
            })

            const hashedPass = await hashPassword('123456')

            await db.User.create({
                id: userId,
                name: item?.contact?.content.find(i => i.name === "Liên hệ:")?.content,
                password: hashedPass,
                phone: item?.contact?.content.find(i => i.name === "Điện thoại:")?.content,
                zalo: item?.contact?.content.find(i => i.name ===  "Zalo")?.content,
                avatar: null
            })
        })
        resolve('Thành công')
    } catch (error) {
        reject(error)
    }
})