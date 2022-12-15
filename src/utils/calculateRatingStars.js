exports.calculateRatingStars = (likesCount, dislikesCount) => {
    const rating = Number((likesCount / (likesCount + dislikesCount) * 5).toFixed(2)) || 0;

    if (rating >= 4.5) return 5;
    if (rating >= 3.5 && rating < 4.5) return 4;
    if (rating >= 2.5 && rating < 3.5) return 3;
    if (rating >= 1.5 && rating < 2.5) return 2;
    if (rating >= 0.5 && rating < 1.5) return 1;
    if (rating >= 0.5 && rating < 1.5) return 1;
    if (rating < 0.5) return 0;

}
