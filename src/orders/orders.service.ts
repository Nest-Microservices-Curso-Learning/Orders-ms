import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { OnModuleInit } from '@nestjs/common';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');



  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database 🗃️');
  }

  create(createOrderDto: CreateOrderDto) {
    return {
      service: 'orders Microservice',
      createOrderDto
    }
    
    // return this.order.create({
    //   data: createOrderDto
    // })
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where:{ 
          status: orderPaginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage) 
      }
    };

  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: {
        id
      }
    });

    if (!order) {
      throw new RpcException({
        status:HttpStatus.NOT_FOUND,
        message: 'Order not found'
      });
    }

    return order;

  }

  
  async changeOrderStatus(changeOrderSttus: ChangeOrderStatusDto) {
    const order = await this.order.findUnique({
      where: {
        id: changeOrderSttus.id
      }
    });

    if(!order)
    {
      throw new RpcException({
        status:HttpStatus.NOT_FOUND,
        message: 'Order not found'
      });
    }

    if(order.status === changeOrderSttus.status)
    {
      return order;
    }

    const orderUpdated = await this.order.update({
      where: {
        id: changeOrderSttus.id
      },
      data: {
        status: changeOrderSttus.status
      }
    });

    return orderUpdated;

  }
}

