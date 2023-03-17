import React from "react";
import { useTranslation } from "react-i18next";

export default function RoomSetting(props){
  const {t} = useTranslation();

  return <div className="w-100">
    RoomSetting
    <div className="d-flex flex-row align-items-center justify-content-center">
      <hr style={{ width: '140px' }} />
      <span className="mx-3 mc-color fw-bold text-uppercase text-center">{t('my clinic')}</span>
      <hr style={{ width: '140px' }} />
    </div>
  </div>
}