/* eslint-disable no-param-reassign */
const { default: mongoose } = require("mongoose");

const createParentChildService = async (
  ParentModel,
  ChildModel,
  parentData,
  childData,
  joinPropertyName
) => {
  //  create a session

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //  first database operation
    const parentOperation = await ParentModel.create([parentData], {
      session,
    });

    // second database operation
    //  after successfully operation
    childData.forEach((obj) => {
      obj[joinPropertyName] = parentOperation[0]._id;
    });
    const childOperation = await ChildModel.create(childData, {
      session,
    });

    // completed all transaction
    await session.commitTransaction();
    await session.endSession();
    return { parent: parentOperation, child: childOperation };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return false;
  }
};

module.exports = createParentChildService;
