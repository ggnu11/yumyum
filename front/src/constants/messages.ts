import i18n from '@/i18n';

const alerts = {
  LOCATION_PERMISSION: {
    get TITLE() { return i18n.t('permission.locationTitle'); },
    get DESCRIPTION() { return i18n.t('permission.locationDescription'); },
  },
  PHOTO_PERMISSION: {
    get TITLE() { return i18n.t('permission.photoTitle'); },
    get DESCRIPTION() { return i18n.t('permission.photoDescription'); },
  },
};

const errorMessages = {
  get UNEXPECT_ERROR() { return i18n.t('common.unknownError'); },
};

export {alerts, errorMessages};
