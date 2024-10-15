import { createClient, RedisClientType } from 'redis';

const redis = () =>{
    let redisClient: RedisClientType | null = null; // Initialize as null
    let isRedisConnected = false; // To track Redis connection status
    let retriesConnectToRedis = 0;
    let retriesRefreshRedisClient = 0;

    // Define the error handler
    const handleRedisError = (error: Error) => {
        if (error.message.includes('Socket closed unexpectedly')) {
            refreshRedisClient(); // Refresh the Redis client
        } else if (error.message.includes('Socket already opened')) {
            console.error('Redis Client Error: Socket already opened');
            // Handle specific case if needed
        } else {
            console.error('Unhandled Redis Client Error:', error.message);
        }
    
        if(redisClient){
            redisClient.off('error', handleRedisError); // Remove the error listener
        }

        isRedisConnected = false;
    };
    
    // Function to create and connect a new Redis client
    async function connectToRedis() {
        if (redisClient) {
            try {
                await redisClient.quit(); // Ensure the previous client is closed
            } catch (error: any) {
                console.error('Error quitting previous Redis client:', error);
            }
        }
    
        redisClient = createClient();
        redisClient.on('error', handleRedisError);
    
        try {
            await redisClient.connect();
            isRedisConnected = true;
            console.log('Connected to Redis successfully');
        } catch (error: any) {
            console.error('Failed to connect to Redis');
            // Optionally retry connecting
            retriesConnectToRedis = retriesConnectToRedis + 1;
            if(retriesConnectToRedis <= 3){
                setTimeout(connectToRedis, 5000); // Retry after 5 seconds
            }
        }
    }
    
    // Function to refresh the Redis client
    async function refreshRedisClient() {
        try {
            if (redisClient) {
                await redisClient.quit(); // Close the existing connection
            }
            // Create a new client and try connecting
            await connectToRedis();
        } catch (error: any) {
            console.error('Error refreshing Redis client');
            // Optionally retry refreshing
            retriesRefreshRedisClient = retriesRefreshRedisClient + 1;
            if(retriesRefreshRedisClient <= 3){
                setTimeout(refreshRedisClient, 5000); // Retry after 5 seconds
            }
        }
    }
    
    // Start connecting to Redis
    connectToRedis();

    return redisClient;
}

export default redis ;