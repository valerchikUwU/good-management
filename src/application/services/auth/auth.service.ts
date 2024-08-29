import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { HttpService } from '@nestjs/axios';
import { ReadUserDto } from "src/contracts/read-user.dto";
import { JwtService } from '@nestjs/jwt';
import { UserVkAuthDto } from "src/contracts/user-vkauth-dto";
import { map, Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { JwtPayloadInterface } from "src/utils/jwt-payload.interface";
import { User } from "src/domains/user.entity";
import { CreateUserDto } from "src/contracts/create-user.dto";


@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService) { }

  async validateUser(payload: JwtPayloadInterface): Promise<User | null> {
    return await this.userService.findOne(payload.id);
  }

  async authenticate(
    auth: ReadUserDto,
  ): Promise<UserVkAuthDto> {
    const user = await this.userService.findOne(auth.id);
    console.log(JSON.stringify(user))
    if (!user) {
      throw new BadRequestException();
    }

    return {
      id: user.id,
      vk_id: user.vk_id,
      firstName: user.firstName,
      lastName: user.lastName,
      telephoneNumber: user.telephoneNumber,
      avatar_url: user.avatar_url,
      token: await this.jwtService.sign({ id: user.id }),
    };
  }

  async getVkToken(code: string): Promise<any> {
    const VKDATA = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const host =
      process.env.NODE_ENV === "prod"
        ? process.env.APP_HOST
        : process.env.APP_LOCAL;

    return this.httpService
      .get(
        `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${host}/gm&code=${code}`
      )
      .toPromise();
  }


  async getUserDataFromVk(userId: string, token: string): Promise<any> {
    return this.httpService
      .get(
        `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_400,has_mobile,home_town,contacts,mobile_phone&access_token=${token}&v=5.120`
      )
      .toPromise();
  }
  // async getVkToken(code: string): Promise<Observable<Object[]>> {
  //     const VKDATA = {
  //       client_id: process.env.CLIENT_ID,
  //       client_secret: process.env.CLIENT_SECRET,
  //     };

  //     const host =
  //       process.env.NODE_ENV === "prod"
  //         ? process.env.APP_HOST
  //         : process.env.APP_LOCAL;

  //     return this.httpService
  //       .get(
  //         `https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${host}/signin&code=${code}`
  //       ).pipe(
  //         map((axiosResponse: AxiosResponse) => {
  //           return axiosResponse.data;
  //         })
  //       );
  //   }
}