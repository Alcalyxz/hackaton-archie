// CONTAINER of the screen `crypto-detail`: reads the asset id from the route, loads its market
// detail through the `coinInfo` port and hands the VIEW a ready view model.

import * as React from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { routes, useAppNavigate } from '@/presentation/navigation';
import type { RepoError } from '../../domain/shared';
import type { AssetTickerDetail } from '../../domain/ports/coin-info.repository';
import { useRepositories } from '../app-context';
import { CryptoDetailView } from '../views/crypto-detail.view';
import { ScreenError, ScreenLoading, ScreenNotFound } from '../screen-state';

export default function CryptoDetailScreenRoute(): React.ReactElement {
  const repositories = useRepositories();
  const navigate = useAppNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [detail, setDetail] = React.useState<AssetTickerDetail | null>(null);
  const [error, setError] = React.useState<RepoError | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (id === undefined || id === '') {
      // Opened without a coin (e.g. from the menu): the list is where one is picked.
      navigate(routes.crypto());
      return undefined;
    }
    let live = true;
    setLoading(true);
    setError(null);
    void repositories.coinInfo
      .byAssetId(id)
      .then((res) => {
        if (!live) return;
        if (res.ok) setDetail(res.data);
        else setError(res.error);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        console.error('[archie] crypto detail failed outside the RepoResult contract:', cause);
        if (!live) return;
        setError({
          kind: 'transport',
          message: 'The query failed in a way the transport could not normalize.',
          detail: 'rejected promise outside the `RepoResult` contract',
        });
        setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [repositories, id, attempt, navigate]);

  const back = React.useCallback((): void => navigate(routes.crypto()), [navigate]);
  const retry = React.useCallback((): void => setAttempt((n) => n + 1), []);

  return (
    <>
      {loading ? (
        <ScreenLoading data-vid="bt252qj" />
      ) : error !== null ? (
        <ScreenError data-vid="dzszswh" error={error} onRetry={retry} />
      ) : detail === null ? (
        <ScreenNotFound data-vid="kv3lggx"
          title={t('cryptoDetail.notFoundTitle', 'Cryptocurrency not found')}
          description={t('cryptoDetail.notFoundDesc', 'Pick one from the Crypto list.')}
        />
      ) : (
        <CryptoDetailView data-vid="cbc18jk" detail={detail} onBack={back} />
      )}
    </>
  );
}
