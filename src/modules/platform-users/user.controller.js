import { userModel } from "./user.model.js";

export const getUserListController = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 30,
      sort: { createdAt: -1 },
    };

    const result = await userModel.aggregate([
      {
        $facet: {
          users: [
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit,
            },
            {
              $sort: options.sort,
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const users = result[0].users;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: 'Users fetched successfully',
      data: {
        users,
        totalCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
