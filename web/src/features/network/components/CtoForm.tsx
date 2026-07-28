import { useMemo, useState, type FormEvent } from 'react'
import { assetStatusSchema, ctoFormSchema, type CtoFormValues } from '@/features/network/domain/schemas'
import { Field, fieldControlClass, FormActions } from '@/features/network/components/FormFields'
import type { Cto, Olt, Pon } from '@/shared/types/network'

const statuses = assetStatusSchema.options

interface CtoFormProps {
  initial?: Cto | null
  olts: Olt[]
  pons: Pon[]
  isSubmitting: boolean
  onSubmit: (values: CtoFormValues) => Promise<void>
  onCancel: () => void
}

export function CtoForm({ initial, olts, pons, isSubmitting, onSubmit, onCancel }: CtoFormProps) {
  const [values, setValues] = useState<CtoFormValues>({
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    oltId: initial?.oltId ?? olts[0]?.id ?? '',
    ponId: initial?.ponId ?? '',
    capacity: initial?.capacity ?? 16,
    occupiedPorts: initial?.occupiedPorts ?? 0,
    splitter: initial?.splitter ?? '1:16',
    distanceMeters: initial?.distanceMeters ?? 500,
    status: initial?.status ?? 'online',
    lat: initial?.lat ?? -23.5505,
    lng: initial?.lng ?? -46.6333,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CtoFormValues, string>>>({})

  const ponsForOlt = useMemo(
    () => pons.filter((pon) => pon.oltId === values.oltId),
    [pons, values.oltId],
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = ctoFormSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof CtoFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CtoFormValues
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
      <Field label="Código" error={errors.code}>
        <input
          className={fieldControlClass}
          value={values.code}
          onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))}
        />
      </Field>
      <Field label="OLT" error={errors.oltId}>
        <select
          className={fieldControlClass}
          value={values.oltId}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              oltId: e.target.value,
              ponId: '',
            }))
          }
        >
          <option value="">Selecione...</option>
          {olts.map((olt) => (
            <option key={olt.id} value={olt.id}>
              {olt.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="PON" error={errors.ponId}>
        <select
          className={fieldControlClass}
          value={values.ponId}
          onChange={(e) => setValues((v) => ({ ...v, ponId: e.target.value }))}
        >
          <option value="">Selecione...</option>
          {ponsForOlt.map((pon) => (
            <option key={pon.id} value={pon.id}>
              {pon.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Capacidade" error={errors.capacity}>
          <input
            type="number"
            className={fieldControlClass}
            value={values.capacity}
            onChange={(e) => setValues((v) => ({ ...v, capacity: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Portas ocupadas" error={errors.occupiedPorts}>
          <input
            type="number"
            className={fieldControlClass}
            value={values.occupiedPorts}
            onChange={(e) => setValues((v) => ({ ...v, occupiedPorts: Number(e.target.value) }))}
          />
        </Field>
      </div>
      <Field label="Splitter" error={errors.splitter}>
        <input
          className={fieldControlClass}
          value={values.splitter}
          onChange={(e) => setValues((v) => ({ ...v, splitter: e.target.value }))}
        />
      </Field>
      <Field label="Distância (m)" error={errors.distanceMeters}>
        <input
          type="number"
          className={fieldControlClass}
          value={values.distanceMeters}
          onChange={(e) => setValues((v) => ({ ...v, distanceMeters: Number(e.target.value) }))}
        />
      </Field>
      <Field label="Status" error={errors.status}>
        <select
          className={fieldControlClass}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as CtoFormValues['status'] }))
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
        submitLabel={initial ? 'Salvar CTO' : 'Cadastrar CTO'}
      />
    </form>
  )
}
