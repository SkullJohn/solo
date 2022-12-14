import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Transfer2 = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);

    const mintAndTransfer2 = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransaction = {
            kind: "moveCall" as const,
            data: {
              packageObjectId: ETHOS_EXAMPLE_CONTRACT,
              module: "example",
              function: "mint",
              typeArguments: [],
              arguments: [],
              gasBudget: 10000,
            },
          };
    
          const response = await wallet.signAndExecuteTransaction(mintTransaction);
          if (response?.effects?.events) {
            const { newObject: { objectId } } = response.effects.events.find((e) => e.newObject);
            
            const transferTransaction = {
              kind: "moveCall" as const,
              data: {
                packageObjectId: ETHOS_EXAMPLE_CONTRACT,
                module: "example",
                function: "transfer",
                typeArguments: [],
                arguments: [
                  objectId,
                  "0x14405eaed227abf06d7368be6501fecf0f6430d1"
                ],
                gasBudget: 10000,
              },
            };

            await wallet.signAndExecuteTransaction(transferTransaction);
            setNftObjectId(objectId);
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    useEffect(() => {
        setNftObjectId(null)
    }, [version])

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.devnet.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View the NFT you created and transferred on the DevNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mintAndTransfer2}
            >
                Mint and Transfer 2
            </button>
        </div>
    )
}

export default Transfer2;