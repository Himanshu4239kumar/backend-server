module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      code: String,
      discountPercentage: Number,
      expiryDate: Date,
      applicableforSize:Number,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Coupon = mongoose.model("coupon", schema);
  return Coupon;
};
