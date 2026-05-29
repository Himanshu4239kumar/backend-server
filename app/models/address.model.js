module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      title:String,
      firstName:String,
      lastName:String,
      street: String,
      city: String,
      postalCode: Number,
      country: String,
      active: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Order = mongoose.model("address", schema);
  return Order;
};
