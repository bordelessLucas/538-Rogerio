import { z } from 'zod'

export const assetStatusSchema = z.enum(['online', 'alert', 'offline', 'disabled'])

export const oltVendorSchema = z.enum([
  'ZTE',
  'Huawei',
  'Fiberhome',
  'Nokia',
  'Datacom',
  'Other',
])

export const oltFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome'),
  vendor: oltVendorSchema,
  ip: z
    .string()
    .trim()
    .regex(/^(?:\d{1,3}\.){3}\d{1,3}$/, 'IP inválido'),
  popId: z.string().min(1, 'Selecione o POP'),
  status: assetStatusSchema,
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
})

export const ponFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome/porta'),
  oltId: z.string().min(1, 'Selecione a OLT'),
  port: z.coerce.number().int().min(1, 'Porta inválida').max(64),
  status: assetStatusSchema,
})

export const ctoFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe o nome'),
    code: z.string().trim().min(2, 'Informe o código'),
    oltId: z.string().min(1, 'Selecione a OLT'),
    ponId: z.string().min(1, 'Selecione a PON'),
    capacity: z.coerce.number().int().min(1).max(64),
    occupiedPorts: z.coerce.number().int().min(0),
    splitter: z.string().trim().min(1, 'Informe o splitter'),
    distanceMeters: z.coerce.number().min(0),
    status: assetStatusSchema,
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  })
  .superRefine((value, ctx) => {
    if (value.occupiedPorts > value.capacity) {
      ctx.addIssue({
        code: 'custom',
        path: ['occupiedPorts'],
        message: 'Ocupadas não podem exceder a capacidade',
      })
    }
  })

export const clientFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome'),
  plan: z.string().trim().min(2, 'Informe o plano'),
  onuModel: z.string().trim().min(2, 'Informe o modelo da ONU'),
  powerDbm: z.coerce.number(),
  lastAccessAt: z.string().min(1, 'Informe o último acesso'),
  ip: z.string().trim().min(7, 'IP inválido'),
  equipment: z.string().trim().min(2, 'Informe o equipamento'),
  mac: z.string().trim().min(10, 'MAC inválido'),
  serial: z.string().trim().min(4, 'Serial inválido'),
  status: assetStatusSchema,
  ctoId: z.string().min(1, 'Selecione a CTO'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
})

export type OltFormValues = z.infer<typeof oltFormSchema>
export type PonFormValues = z.infer<typeof ponFormSchema>
export type CtoFormValues = z.infer<typeof ctoFormSchema>
export type ClientFormValues = z.infer<typeof clientFormSchema>

export function deriveCtoPorts(capacity: number, occupiedPorts: number) {
  const freePorts = Math.max(0, capacity - occupiedPorts)
  const occupancyPercent =
    capacity === 0 ? 0 : Math.round((occupiedPorts / capacity) * 1000) / 10
  return { freePorts, occupancyPercent }
}
