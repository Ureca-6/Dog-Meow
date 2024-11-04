import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { OrderItem } from 'src/entity/orderItem.entity';
import { ProductReview } from 'src/entity/productReview.entity';
import { User } from 'src/entity/user.entity';
import { CreateReviewRequestDto } from 'src/review/dto/createReviewRequest.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private productReviewRepository: Repository<ProductReview>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getProductReviewById(productId: string) {
    const result = await this.productReviewRepository.find({
      where: { product: { productId } },
      relations: ['user'],
    });

    if (result.length === 0) {
      throw new HttpException(
        '리뷰를 찾을 수 없습니다dd.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }
  async createProductReview(userId: string, content: CreateReviewRequestDto) {
    const review = this.productReviewRepository.create({
      user: { userId },
      product: { productId: content.productId },
      text: content.text,
      score: content.score,
    });

    await this.productReviewRepository.save(review);

    return review;
  }

  async deleteProductReview(productReviewId: string, userId: string) {
    const review = await this.productReviewRepository.findOne({
      where: { productReviewId },
    });

    if (!review) {
      throw new HttpException(
        '리뷰를 찾을 수 없습니다www.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (review.user.userId !== userId) {
      throw new HttpException(
        '리뷰를 삭제할 권한이 없습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.productReviewRepository.delete(productReviewId);

    if (result.affected === 0) {
      throw new HttpException(
        '리뷰를 삭제를 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }

  async getMyReviews(userId: string) {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new HttpException(
        '사용자를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const orders = await this.orderRepository.find({
      where: { user },
      relations: ['product'],
    });

    if (orders.length === 0) {
      throw new HttpException('주문 내역이 없습니다.', HttpStatus.BAD_REQUEST);
    }

    return orders;

    // const result = await this.productReviewRepository.find({
    //   where: { user },
    //   relations: ['product'],
    // });

    // if (result.length === 0) {
    //   throw new HttpException(
    //     '리뷰를 찾을 수 없습니다.',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // const formattedReviews = result.map((review) => ({
    //   productId: review.product.productId,
    //   title: review.product.title,
    //   price: review.product.price,
    //   productImg: review.product.productImg,
    //   quantity: review.product.quantity,
    // }));

    // return formattedReviews;
  }

  async getOrderItemsWithReviews(userId: string) {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order') // Order 조인
      .leftJoinAndSelect('order.user', 'user') // User 조인
      .leftJoinAndSelect('orderItem.product', 'product') // Product 조인
      .leftJoinAndSelect('product.reviews', 'reviews') // Product와 리뷰 조인
      .where('user.userId = :userId', { userId }) // 사용자 ID 필터링
      .getMany();

    const reviews = orderItems.map((review) => ({
      productImg: review.product.productImg,
      title: review.product.title,
      price: review.product.price,
      state: review.order.orderState, // Changed to match the desired state
      quantity: review.quantity,
    }));

    return reviews;
  }
}
