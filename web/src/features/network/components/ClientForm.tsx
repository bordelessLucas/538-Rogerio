import { useState, type FormEvent } from 'react'
import {
  assetStatusSchema,
  clientFormSchema,
  type ClientFormValues,
} from '@/features/network/domain/schemas'
import { Field, fieldControlClass, FormActions } from '@/features/network/components/FormFields'
import type { Client, Cto } from '@/shared/types/network'

const statuses = assetStatusSchema.options

interface ClientFormProps {
  initial?: Client | null
  ctos: Cto[]
  isSubmitting: boolean
  onSubmit: (values: ClientFormValues) => Promise<void>
  onCancel: () => void
  /** Mantém lat/lng (ex.: cadastro via duplo clique no mapa). */
  lockCoordinates?: boolean
}

export function ClientForm({
  initial,
  ctos,
  isSubmitting,
  onSubmit,
  onCancel,
  lockCoordinates = false,
}: ClientFormProps) {
  const defaultCto = ctos.find((cto) => cto.id === initial?.ctoId) ?? ctos[0]
  const [values, setValues] = useState<ClientFormValues>({
    name: initial?.name ?? '',
    plan: initial?.plan ?? '500 Mega',
    onuModel: initial?.onuModel ?? 'ZTE F670L',
    powerDbm: initial?.powerDbm ?? -22,
    lastAccessAt: initial?.lastAccessAt ?? new Date().toISOString(),
    ip: initial?.ip ?? '100.64.10.10',
    equipment: initial?.equipment ?? 'ONU Bridge',
    mac: initial?.mac ?? 'AA:BB:CC:11:22:00',
    serial: initial?.serial ?? 'ZTEG00000000',
    status: initial?.status ?? 'online',
    ctoId: initial?.ctoId ?? defaultCto?.id ?? '',
    lat: initial?.lat ?? defaultCto?.lat ?? -23.5505,
    lng: initial?.lng ?? defaultCto?.lng ?? -46.6333,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({})

  function handleCtoChange(ctoId: string) {
    const cto = ctos.find((item) => item.id === ctoId)
    setValues((prev) => ({
      ...prev,
      ctoId,
      ...(lockCoordinates || !cto
        ? {}
        : {
            lat: cto.lat + 0.0004,
            lng: cto.lng + 0.0004,
          }),
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = clientFormSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof ClientFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ClientFormValues
        next[key] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    await onSubmit(parsed.data)
  }

  return (
    <form className="space-y-3" onSubmit={(event) => void handleSubmit(event)}>
      <Field label="Nome" error={errors.name}>
        <input
          className={fieldControlClass}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </Field>
      <Field label="Plano" error={errors.plan}>
        <input
          className={fieldControlClass}
          value={values.plan}
          onChange={(e) => setValues((v) => ({ ...v, plan: e.target.value }))}
        />
      </Field>
      <Field label="CTO" error={errors.ctoId}>
        <select
          className={fieldControlClass}
          value={values.ctoId}
          onChange={(e) => handleCtoChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {ctos.map((cto) => (
            <option key={cto.id} value={cto.id}>
              {cto.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="ONU" error={errors.onuModel}>
          <input
            className={fieldControlClass}
            value={values.onuModel}
            onChange={(e) => setValues((v) => ({ ...v, onuModel: e.target.value }))}
          />
        </Field>
        <Field label="Potência (dBm)" error={errors.powerDbm}>
          <input
            type="number"
            step="any"
            className={fieldControlClass}
            value={values.powerDbm}
            onChange={(e) => setValues((v) => ({ ...v, powerDbm: Number(e.target.value) }))}
          />
        </Field>
      </div>
      <Field label="Último acesso (ISO)" error={errors.lastAccessAt}>
        <input
          className={fieldControlClass}
          value={values.lastAccessAt}
          onChange={(e) => setValues((v) => ({ ...v, lastAccessAt: e.target.value }))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="IP" error={errors.ip}>
          <input
            className={fieldControlClass}
            value={values.ip}
            onChange={(e) => setValues((v) => ({ ...v, ip: e.target.value }))}
          />
        </Field>
        <Field label="Equipamento" error={errors.equipment}>
          <input
            className={fieldControlClass}
            value={values.equipment}
            onChange={(e) => setValues((v) => ({ ...v, equipment: e.target.value }))}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="MAC" error={errors.mac}>
          <input
            className={fieldControlClass}
            value={values.mac}
            onChange={(e) => setValues((v) => ({ ...v, mac: e.target.value }))}
          />
        </Field>
        <Field label="Serial" error={errors.serial}>
          <input
            className={fieldControlClass}
            value={values.serial}
            onChange={(e) => setValues((v) => ({ ...v, serial: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="Status" error={errors.status}>
        <select
          className={fieldControlClass}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as ClientFormValues['status'] }))
          }
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude" error={errors.lat}>
          <input
            type="number"
            step="any"
            className={fieldControlClass}
            value={values.lat}
            onChange={(e) => setValues((v) => ({ ...v, lat: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Longitude" error={errors.lng}>
          <input
            type="number"
            step="any"
            className={fieldControlClass}
            value={values.lng}
            onChange={(e) => setValues((v) => ({ ...v, lng: Number(e.target.value) }))}
          />
        </Field>
      </div>
      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        submitLabel={initial ? 'Salvar cliente' : 'Cadastrar cliente'}
      />
    </form>
  )
}
