export type StudentRangeValue = 'up-to-100' | '100-300' | '300-1000' | '1000-plus'

export interface DemoFormValues {
  name: string
  gymName: string
  email: string
  whatsapp: string
  studentsRange: string
  acceptedTerms: boolean
}

export interface DemoFormFieldErrors {
  name?: string
  gymName?: string
  email?: string
  whatsapp?: string
  studentsRange?: string
  acceptedTerms?: string
}

/** Payload esperado por POST /api/leads */
export interface LeadCreatePayload {
  nome: string
  academia: string
  email: string
  whatsapp: string
  numero_de_alunos: number
  aceite_termos: boolean
  origem: string
}
