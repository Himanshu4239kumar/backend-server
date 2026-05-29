module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      id: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      challengeSize: Number,
      challengeType: String,
      amount: Number,
      method: String,
      txid: String,
      fileName: String,

      active: Boolean,
    },
    { timestamps: true },
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Payment = mongoose.model("payment", schema);
  return Payment;
};
