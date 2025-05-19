
import { Alchemy, Network } from 'alchemy-sdk';

export default async function handler(req, res) {
  const { address } = req.query;
  const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

  if (!address) return res.status(400).json({ error: 'Address is required' });

  try {
    const config = {
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    const balance = await alchemy.core.getBalance(address);
    const txs = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: ["external", "erc20"],
      maxCount: 5
    });

    res.status(200).json({
      balance: (parseInt(balance._hex, 16) / 1e18).toFixed(4),
      txs: txs.transfers || []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
