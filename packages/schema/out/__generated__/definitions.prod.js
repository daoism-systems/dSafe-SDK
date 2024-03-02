// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Safe":{"id":"kjzl6hvfrbw6c6sg45xjvhiwk70lw68aji1gf5rq5c6tfdxlzngkeg0cr27qbdc","accountRelation":{"type":"list"}},"Token":{"id":"kjzl6hvfrbw6cavrz5xaq0ncc8i95zb1eo6v94mion85kqi3lxs283ab52n0p2s","accountRelation":{"type":"list"}},"Signer":{"id":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","accountRelation":{"type":"list"}},"SignerSafeRelationship":{"id":"kjzl6hvfrbw6ca9pmhv1sic9614ktx3ivhfvve6lf15qbhlyslkclseafeq33s7","accountRelation":{"type":"list"}},"Delegate":{"id":"kjzl6hvfrbw6c97098wyqs8mgl3ljp34675a3evc865valqsqnoczudz2hxjfn3","accountRelation":{"type":"list"}},"Transaction":{"id":"kjzl6hvfrbw6c8t8lzv1nw0u6fq51ymg03c2sbxbsp0sqyffi5dfmzjttbwqmq8","accountRelation":{"type":"list"}},"Confirmation":{"id":"kjzl6hvfrbw6c51jd64p1tcmvaq7a6e0e8m65s40wy9oajgppbwxk5m3s4lthmi","accountRelation":{"type":"list"}}},"objects":{"Safe":{"guard":{"type":"string","required":true},"nonce":{"type":"integer","required":true},"network":{"type":"chainid","required":true,"indexed":true},"version":{"type":"string","required":true},"singleton":{"type":"string","required":true},"threshold":{"type":"integer","required":true},"safeAddress":{"type":"string","required":true,"indexed":true},"fallbackHandler":{"type":"string","required":true},"totalTransactions":{"type":"integer","required":true},"nativeTokenBalance":{"type":"string","required":true},"deployedBlockNumber":{"type":"integer","required":true,"indexed":true},"tokens":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6cavrz5xaq0ncc8i95zb1eo6v94mion85kqi3lxs283ab52n0p2s","property":"safeId"}},"signers":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6ca9pmhv1sic9614ktx3ivhfvve6lf15qbhlyslkclseafeq33s7","property":"safeID"}},"delegates":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","property":"safeID"}},"transactions":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c8t8lzv1nw0u6fq51ymg03c2sbxbsp0sqyffi5dfmzjttbwqmq8","property":"safeID"}}},"Token":{"name":{"type":"string","required":true,"indexed":true},"safeId":{"type":"streamid","required":true},"symbol":{"type":"string","required":true,"indexed":true},"balance":{"type":"string","required":true},"logoUri":{"type":"uri","required":true},"network":{"type":"chainid","required":true,"indexed":true},"decimals":{"type":"integer","required":true},"tokenAddress":{"type":"string","required":true,"indexed":true},"safe":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c6sg45xjvhiwk70lw68aji1gf5rq5c6tfdxlzngkeg0cr27qbdc","property":"safeId"}}},"Signer":{"signer":{"type":"string","required":true,"indexed":true},"signerSafeRelations":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6ca9pmhv1sic9614ktx3ivhfvve6lf15qbhlyslkclseafeq33s7","property":"signerID"}}},"SignerSafeRelationship":{"safeID":{"type":"streamid","required":true,"indexed":true},"network":{"type":"chainid","required":true,"indexed":true},"signerID":{"type":"streamid","required":true,"indexed":true},"blockWhenAdded":{"type":"integer","required":true},"safe":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c6sg45xjvhiwk70lw68aji1gf5rq5c6tfdxlzngkeg0cr27qbdc","property":"safeID"}},"signer":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","property":"signerID"}}},"Delegate":{"safeID":{"type":"streamid","required":true,"indexed":true},"network":{"type":"chainid","required":true,"indexed":true},"delegate":{"type":"string","required":true,"indexed":true},"delegatorID":{"type":"streamid","required":true,"indexed":true},"safe":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c6sg45xjvhiwk70lw68aji1gf5rq5c6tfdxlzngkeg0cr27qbdc","property":"safeID"}},"delegator":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","property":"delegatorID"}}},"Transaction":{"to":{"type":"string","required":true,"indexed":true},"data":{"type":"string","required":true},"nonce":{"type":"integer","required":true,"indexed":true},"value":{"type":"integer","required":true},"origin":{"type":"string","required":false},"safeID":{"type":"streamid","required":true,"indexed":true},"sender":{"type":"string","required":true},"baseGas":{"type":"integer","required":true},"network":{"type":"chainid","required":true,"indexed":true},"trxHash":{"type":"string","required":false},"executor":{"type":"string","required":false,"indexed":true},"gasPrice":{"type":"integer","required":true},"gasToken":{"type":"string","required":true},"operation":{"type":"string","required":true},"safeTxGas":{"type":"integer","required":true},"signature":{"type":"string","required":true},"refundReceiver":{"type":"string","required":true},"safeTransactionHash":{"type":"string","required":true,"indexed":true},"safe":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c6sg45xjvhiwk70lw68aji1gf5rq5c6tfdxlzngkeg0cr27qbdc","property":"safeID"}},"confirmations":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","property":"transactionId"}}},"Confirmation":{"signerID":{"type":"streamid","required":true,"indexed":true},"signature":{"type":"string","required":true},"transactionId":{"type":"streamid","required":true,"indexed":true},"signer":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c74domu0ishhw31zm631jy6iq0v409ouyo93i9ktzgbp3yajiyh","property":"signerID"}},"safeTransactionHash":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8t8lzv1nw0u6fq51ymg03c2sbxbsp0sqyffi5dfmzjttbwqmq8","property":"transactionId"}}}},"enums":{},"accountData":{"safeList":{"type":"connection","name":"Safe"},"tokenList":{"type":"connection","name":"Token"},"signerList":{"type":"connection","name":"Signer"},"signerSafeRelationshipList":{"type":"connection","name":"SignerSafeRelationship"},"delegateList":{"type":"connection","name":"Delegate"},"transactionList":{"type":"connection","name":"Transaction"},"confirmationList":{"type":"connection","name":"Confirmation"}}}