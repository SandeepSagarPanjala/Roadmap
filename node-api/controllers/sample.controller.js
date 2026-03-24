exports.getHello = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from the sample controller!",
  });
};

exports.postData = (req, res) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No data provided.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Data received successfully.",
    receivedData: data,
  });
};
