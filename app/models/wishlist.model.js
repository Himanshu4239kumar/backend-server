module.exports = mongoose => {
  const wishlistSchema = mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      status: {
        type: Boolean,
        default: true
      }
    },
    { timestamps: true }
  );

  const Wishlist = mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);
  return Wishlist;
}