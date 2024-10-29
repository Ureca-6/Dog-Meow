import { Flex } from '@components/common/Flex';
import { colors } from '@styles/colors';
import ReviewStats from '@components/store/detail/ReviewStats';
import DetailButton from '@components/store/detail/DetailButton';
import reviews from '@/mocks/data/review.json';
import ProductReviewItem from './ProductReviewItem';
import { ReviewText } from '@components/store/detail/ReviewText';
import { calculateScoreCounts } from '@/utils/scoreCounts';

const ProductReview = () => {
  const reviewCount = reviews.length;
  const score = reviews.reduce((acc, cur) => acc + cur.score, 0) / reviewCount;

  const scoreCounts = calculateScoreCounts(reviews);

  const handleNewReviewClick = () => {
    /* 버튼 클릭 시 행동 정의 */
  };

  return (
    <Flex direction="column" gap={24}>
      <Flex direction="column" justify="flex-start" padding="0px 16px">
        <ReviewText
          typo="Heading3"
          justify="flex-start"
          width="100%"
          fontWeight="600"
        >
          {`후기 ${reviewCount}개`}
        </ReviewText>
        <ReviewStats score={score} scoreCounts={scoreCounts} />
      </Flex>
      <DetailButton
        handleButtonClick={handleNewReviewClick}
        colorCode={colors.MainColor}
      >
        새로운 후기 작성하기
      </DetailButton>
      <div />
      {reviews.map((review, index) => (
        <ProductReviewItem review={review} key={index} />
      ))}
    </Flex>
  );
};

export default ProductReview;