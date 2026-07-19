module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      code: String,
      discountPercentage: Number,
      expiryDate: Date,
      applicableForSize: Number, // 🚨 FIX 1: 'F' ko capital kar diya taaki frontend se match ho
      isActive: { type: Boolean, default: true } // 🚨 FIX 2: Yeh field zaroori thi active coupons filter karne ke liye
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