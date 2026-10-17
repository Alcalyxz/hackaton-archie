// ViewModel of the `crypto-detail` screen: the market detail of ONE cryptocurrency.

import type { AssetTickerDetail } from '../../domain/ports/coin-info.repository';

export interface CryptoDetailScreenViewModel {
  readonly detail: AssetTickerDetail;
  /** Goes back to the Crypto list. */
  readonly onBack: () => void;
}
