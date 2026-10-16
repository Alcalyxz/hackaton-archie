// Detail of a cryptocurrency as the market data provider describes it (website, explorer,
// all-time high, supply, first listing). Read-only: there is nothing to write.

import type { RepoResult } from '../shared';

export interface CoinInfo {
  /** The provider's own id for the coin (the asset's `externalId`). */
  externalId: string;
  symbol: string;
  name: string;
  nameId: string | null;
  logo: string | null;
  website: string | null;
  twitter: string | null;
  explorer: string | null;
  rank: number | null;
  ath: number | null;
  athDate: string | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  startDate: string | null;
  platform: string | null;
  firstPrice: number | null;
  firstPriceDate: string | null;
}

export interface CoinInfoRepository {
  /** Loads the detail of the asset with this id (the app's asset id, not the provider's). */
  byAssetId(assetId: string): Promise<RepoResult<CoinInfo>>;
}
