const success = (res, data = []) => {
  try {
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    //ignore
  }
};

const fail = (res, error) => {
  try {
    res.json({
      status: "fail",
      error: error,
      data: [],
    });
  } catch (err) {
    //ignore
  }
};

module.exports = {
  success,
  fail,
};
