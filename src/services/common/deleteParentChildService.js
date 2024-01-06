/* eslint-disable no-param-reassign */
const { default: mongoose } = require("mongoose");

const deleteParentChildService = async (
  ParentModel,
  ChildModel,
  _id,
  email,
  joinPropertyName
) => {
  //  create a session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //  first database operation
    const parentOperation = await ParentModel.deleteMany({
      _id,
      userEmail: email,
    }).session(session);

    // second database operation
    const childOperation = await ChildModel.deleteMany({
      userEmail: email,
      [joinPropertyName]: _id,
    }).session(session);

    // completed all transaction
    await session.commitTransaction();
    await session.endSession();
    return { parent: parentOperation, child: childOperation };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    return false;
  }
};

module.exports = deleteParentChildService;
