import {Prisma, PrismaClient} from '@prisma/client'

export abstract class PrismaClientUtils {
    /**
     * Create a Prisma client that should be the only one used across all the application.
     * We start the Prisma client with all the logs level enabled by default.
     * If the logs level are present in the environment variables (DATABASE_LOG_LEVELS) we take those instead.
     */
    static async initPrismaClient(): Promise<PrismaClient> {
        const defaultLogLevels: Prisma.LogLevel[] = [
            'query',
            'info',
            'warn',
            'error',
        ]
        let logLevels: Prisma.LogLevel[] = defaultLogLevels
        if (process.env.DATABASE_LOG_LEVELS) {
            const envLogLevels = process.env.DATABASE_LOG_LEVELS.split(',')
            logLevels = defaultLogLevels.filter((logLevel) =>
                envLogLevels.includes(logLevel)
            )
        }

        const prismaClient = new PrismaClient({
            log: logLevels,
        })

        await this.checkPrismaClient(prismaClient)

        return prismaClient
    }

    /**
     * Test that a prisma client is working properly by executing a basic query
     * @param prismaClient the prisma client to test
     */
    static async checkPrismaClient(prismaClient: PrismaClient) {
        // disabled while there's nothing in DB
        // await prismaClient.$queryRaw(Prisma.sql`SELECT * FROM _prisma_migrations`)
    }

}
