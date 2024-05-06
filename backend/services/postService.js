import db from '../models/index.js'
import { Op } from 'sequelize';

export const getPostService = async (page, pageSize, priceCode, areaCode, categoryCode) => {
    try {
        const offset = (page - 1) * pageSize;
        const valueFilter = [];
        if (priceCode) {
            valueFilter.push({ priceCode });
        }

        if (areaCode) {
            valueFilter.push({ areaCode });
        }
        
        if (categoryCode) {
            valueFilter.push({ categoryCode });
        }
        const posts = await db.Post.findAll({
            where: {
                [Op.and]: valueFilter
            },
            limit: pageSize,
            offset: offset
        });

        const currentPageTotal = await db.Post.findAll({
            where: {
                [Op.and]: valueFilter
            },
        })

        const totalCount = await db.Post.count();
        const totalPages = Math.ceil(currentPageTotal.length / pageSize);

        return {
            status: true,
            message: 'Lấy dữ liệu thành công!',
            posts,
            totalPages,
            currentPage: page,
            totalCount
        };
    } catch (error) {
        console.log(error);
    }
}

export const getNewPostService = async () => {
    try {
        const posts = await db.Post.findAll({
            raw: true,
            nest: true,
            order:  [['createdAt', 'desc']],
            offset: 0,
            limit: 5,
        });

        return {
            status: true,
            message: 'Lấy dữ liệu thành công!',
            posts,
        };
    } catch (error) {
        console.log(error);
    }
}

export const getPostSearchService = async (page, pageSize, keyword) => {
    try {
        const offset = (page - 1) * pageSize;
        const posts = await db.Post.findAll({
            where: {
              title: {
                [Op.like]: `%${keyword}%`
              }
            },
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description'],
            limit: pageSize,
            offset: offset
          });

          const currentPageTotal = await db.Post.findAll({
            where: {
                title: {
                    [Op.like]: `%${keyword}%`
                }}
            })

        const totalCount = await db.Post.count();
        const totalPages = Math.ceil(currentPageTotal.length / pageSize);

        return {
            status: true,
            message: 'Lấy dữ liệu thành công!',
            posts,
            totalPages,
            currentPage: page,
            totalCount
        };
    } catch (error) {
        console.log(error);
    }
}