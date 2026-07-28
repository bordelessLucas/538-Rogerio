import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { STATUS_HEX, TYPE_LABEL } from '@/features/map/constants'
import type { MapAsset } from '@/features/map/domain/mapTypes'
import { assetDetailPath, createAssetIcon } from '@/features/map/utils/markerIcon'
import { STATUS_LABEL } from '@/shared/utils'

function PopupBody({ asset }: { asset: MapAsset }) {
  switch (asset.type) {
    case 'cto':
      return (
        <>
          <p>
            Portas: {asset.occupiedPorts}/{asset.capacity} · livres {asset.freePorts}
          </p>
          <p>Status: {STATUS_LABEL[asset.status]}</p>
        </>
      )
    case 'client':
      return (
        <>
          <p>Plano: {asset.plan}</p>
          <p>Potência: {asset.powerDbm.toFixed(1)} dBm</p>
          <p>Status: {STATUS_LABEL[asset.status]}</p>
        </>
      )
    case 'olt':
      return (
        <>
          <p>Vendor: {asset.vendor}</p>
          <p>Status: {STATUS_LABEL[asset.status]}</p>
        </>
      )
    case 'pop':
      return <p>{asset.address}</p>
  }
}

export function AssetMarker({ asset }: { asset: MapAsset }) {
  const icon = createAssetIcon(asset.type, asset.status)

  return (
    <Marker position={[asset.lat, asset.lng]} icon={icon}>
      <Popup className="r20-map-popup">
        <div className="space-y-1 text-sm">
          <p className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: STATUS_HEX[asset.status] }}>
            {TYPE_LABEL[asset.type]}
          </p>
          <p className="font-semibold text-slate-900">{asset.name}</p>
          <div className="text-slate-600">
            <PopupBody asset={asset} />
          </div>
          <Link
            to={assetDetailPath(asset)}
            className="mt-2 inline-block text-sky-600 hover:underline"
          >
            Ver detalhes →
          </Link>
        </div>
      </Popup>
    </Marker>
  )
}
