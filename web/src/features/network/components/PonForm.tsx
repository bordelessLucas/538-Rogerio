import { useState, type FormEvent } from 'react'
import { assetStatusSchema, ponFormSchema, type PonFormValues } from '@/features/network/domain/schemas'
import { Field, fieldControlClass, FormActions } from '@/features/network/components/FormFields'
import type { Olt, Pon } from '@/shared/types/network'

const statuses = assetStatusSchema.options

interface PonFormProps {
  initial?: Pon | null
  olts: Olt[]
  isSubmitting: boolean
  onSubmit: (values: PonFormValues) => Promise<void>
  onCancel: () => void
}

export function PonForm({ initial, olts, isSubmitting, onSubmit, onCancel }: PonFormProps) {
  const [values, setValues] = useState<PonFormValues>({
    name: initial?.name ?? '',
    oltId: initial?.oltId ?? olts[0]?.id ?? '',
    port: initial?.port ?? 1,
    status: initial?.status ?? 'online',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof PonFormValues, string>>>({})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = ponFormSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof PonFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof PonFormValues
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
      <Field label="Nome / porta" error={errors.name}>
        <input
          className={fieldControlClass}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </Field>
      <Field label="Porta" error={errors.port}>
        <input
          type="number"
          className={fieldControlClass}
          value={values.port}
          onChange={(e) => setValues((v) => ({ ...v, port: Number(e.target.value) }))}
        />
      </Field>
      <Field label="OLT" error={errors.oltId}>
        <select
          className={fieldControlClass}
          value={values.oltId}
          onChange={(e) => setValues((v) => ({ ...v, oltId: e.target.value }))}
        >
          <option value="">Selecione...</option>
          {olts.map((olt) => (
            <option key={olt.id} value={olt.id}>
              {olt.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status" error={errors.status}>
        <select
          className={fieldControlClass}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as PonFormValues['status'] }))
          }
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </Field>
      <FormActions
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        submitLabel={initial ? 'Salvar PON' : 'Cadastrar PON'}
      />
    </form>
  )
}
