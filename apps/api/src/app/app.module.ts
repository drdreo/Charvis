import { Module } from '@nestjs/common';
import { SocketModule } from '@charvis/api/socket';


@Module({
    imports: [SocketModule],
    controllers: [],
    providers: []
})
export class AppModule {}
