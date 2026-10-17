import type * as React from 'react';
import { useTranslation } from 'react-i18next';
import { UploadField } from '@/components/upload-field';
import { useUploaderHook } from '../../app-context';

/** Avatar picker wired to the app's file storage. The uploaded file's id is handed to
 *  `onUploaded`; the caller links it to the user. */
export function AvatarUploader(props: {
  readonly value?: string | null;
  readonly disabled?: boolean;
  readonly onUploaded: (fileId: string) => void;
}): React.ReactElement {
  const { t } = useTranslation();
  const uploader = useUploaderHook()();
  return (
    <UploadField data-vid="lmdenky"
      variant="avatar"
      label={t('account.avatar.label', 'Profile photo')}
      description={t('account.avatar.description', 'PNG or JPG, up to 5 MB.')}
      uploader={uploader}
      value={props.value ?? null}
      disabled={props.disabled}
      onUploaded={(file) => props.onUploaded(file.fileId)}
    />
  );
}
