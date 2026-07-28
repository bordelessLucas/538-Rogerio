import { useState, type FormEvent } from 'react'
import {
  assetStatusSchema,
  oltFormSchema,
  oltVendorSchema,
  type OltFormValues,
} from '@/features/network/domain/schemas'
import { Field, fieldControlClass, FormActions } from '@/features/network/components/FormFields'
import type { Olt, Pop } from '@/shared/types/network'

const statuses = assetStatusSchema.options
const vendors = oltVendorSchema.options

interface OltFormProps {
  initial?: Olt | null
  pops: Pop[]
  isSubmitting: boolean
  onSubmit: (values: OltFormValues) => Promise<void>
  onCancel: () => void
}

export function OltForm({ initial, pops, isSubmitting, onSubmit, onCancel }: OltFormProps) {
  const [values, setValues] = useState<OltFormValues>({
    name: initial?.name ?? '',
    vendor: initial?.vendor ?? 'ZTE',
    ip: initial?.ip ?? '',
    popId: initial?.popId ?? pops[0]?.id ?? '',
    status: initial?.status ?? 'online',
    lat: initial?.lat ?? -23.5505,
    lng: initial?.lng ?? -46.6333,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof OltFormValues, string>>>({})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = oltFormSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof OltFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof OltFormValues
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
      <Field label="Fabricante" error={errors.vendor}>
        <select
          className={fieldControlClass}
          value={values.vendor}
          onChange={(e) =>
            setValues((v) => ({ ...v, vendor: e.target.value as OltFormValues['vendor'] }))
          }
        >
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </Field>
      <Field label="IP" error={errors.ip}>
        <input
          className={fieldControlClass}
          value={values.ip}
          onChange={(e) => setValues((v) => ({ ...v, ip: e.target.value }))}
        />
      </Field>
      <Field label="POP" error={errors.popId}>
        <select
          className={fieldControlClass}
          value={values.popId}
          onChange={(e) => setValues((v) => ({ ...v, popId: e.target.value }))}
        >
          <option value="">Selecione...</option>
          {pops.map((pop) => (
            <option key={pop.id} value={pop.id}>
              {pop.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status" error={errors.status}>
        <select
          className={fieldControlClass}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as OltFormValues['status'] }))
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
        submitLabel={initial ? 'Salvar OLT' : 'Cadastrar OLT'}
      />
    </form>
  )
}
