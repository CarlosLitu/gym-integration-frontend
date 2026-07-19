import { apiClient } from '@/services/api-client'
import type { DemoFormValues, LeadCreatePayload, StudentRangeValue } from '../types/demo.types'

const STUDENT_RANGE_TO_COUNT: Record<StudentRangeValue, number> = {
  'up-to-100': 100,
  '100-300': 300,
  '300-1000': 1000,
  '1000-plus': 1500,
}

function toStudentCount(range: string): number {
  if (range in STUDENT_RANGE_TO_COUNT) {
    return STUDENT_RANGE_TO_COUNT[range as StudentRangeValue]
  }

  throw new Error(`Invalid students range: ${range}`)
}

export function toLeadCreatePayload(values: DemoFormValues): LeadCreatePayload {
  return {
    nome: values.name.trim(),
    academia: values.gymName.trim(),
    email: values.email.trim(),
    whatsapp: values.whatsapp.trim(),
    numero_de_alunos: toStudentCount(values.studentsRange),
    aceite_termos: values.acceptedTerms,
    origem: 'landing_page',
  }
}

export async function requestDemoRequest(values: DemoFormValues) {
  const payload = toLeadCreatePayload(values)
  const response = await apiClient.post<{ message: string }>('/api/leads', payload)
  return response.data
}
