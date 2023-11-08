import Logger from "../utils/Logger.utils";


const log = new Logger();

function handleDSafeLog(apiRoute: string) {
    log.info('Using DSafe Registry and then SafeTransaction API. API Route:', [apiRoute]);
}
export default function handleDSafeRequest(httpMethod: 'POST' | 'GET' | 'DELETE',apiRoute: string, payload?: unknown, network?: string){
    switch(apiRoute){
        case 'v1/data-decoder/':
            handleDataDecoder(apiRoute, payload, network);
            return;
        default: 
            log.info('Using Safe Transaction API instead of DSafe Registry. API Route:', [apiRoute]);
            return;
    }
}

// api route
function handleDataDecoder(apiRoute: string, payload?: unknown, network?: string) {
    handleDSafeLog(apiRoute);
    log.info("Handle Data Decoder", [apiRoute]);
}
