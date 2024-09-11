import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsString, isUUID } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from '@prisma/client';

export class ChangeOrderStatusDto {
  
  @IsString()
  id: string;


  @IsEnum(OrderStatus,{
    message: `status must be one of the following values: ${Object.values(OrderStatusList)}`
  })
  status: OrderStatus;
}
