{{- define "gym-integration-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "gym-integration-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "gym-integration-frontend.labels" -}}
app.kubernetes.io/name: {{ include "gym-integration-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
