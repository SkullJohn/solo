import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants'
import SuccessMessage from './SuccessMessage';

const Modify = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);

    const mintAndModify = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const transaction = {
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
    
          const response = await wallet.signAndExecuteTransaction(transaction);
          if (response?.effects?.events) {
            const { newObject: { objectId } } = response.effects.events.find((e) => e.newObject);
            
            const moveTransaction = {
                kind: "moveCall" as const,
                data: {
                  packageObjectId: ETHOS_EXAMPLE_CONTRACT,
                  module: "example",
                  function: "modify",
                  typeArguments: [],
                  arguments: [
                    objectId, 
                    "What's up?"
                  ],
                  gasBudget: 10000,
                },
            };

            const moveResponse = await wallet.signAndExecuteTransaction(moveTransaction);
            console.log("moveResponse", moveResponse)
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
                        View the NFT you created and modified on the DevNet Explorer 
                    </a>
                </SuccessMessage>
              )}
              <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mintAndModify}
              >
                Mint and Modify
              </button>
          </div>
    )
}

export default Modify;