import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, Inject } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { Logger } from 'winston';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject('winston')
        private readonly logger: Logger) { }

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const request = ctx.getRequest(); // Получаем объект запроса
        const exceptionResponse: any = exception.getResponse();


        // Логируем ошибки валидации
        if (Array.isArray(exceptionResponse.message) && exceptionResponse.message[0] instanceof ValidationError) {
            const validationErrors = exceptionResponse.message as ValidationError[];

            const errors = validationErrors.map((error) => {
                // Формируем сообщение с указанием конкретного поля и ошибки
                return {
                    field: error.property,
                    errors: Object.values(error.constraints), // Содержит список ошибок для поля
                };
            });

            this.logger.error('Ошибка валидации', JSON.stringify({ url: request.url, method: request.method, errors: JSON.stringify(errors) }));

            return response.status(status).json({
                statusCode: status,
                message: 'Ошибка валидации',
                errors,
            });
        }

        // Обрабатываем другие виды исключений
        this.logger.error((exception.message), { exception });

        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });
    }
}
