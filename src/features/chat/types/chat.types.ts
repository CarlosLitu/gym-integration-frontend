export interface ChatConversation {
  id: string
  tenantId: string
  instanceName: string
  remoteJid: string
  phoneNumber: string
  name: string
  namePending: boolean
  pushName: string
  source: string
  lastMessageDate: string | null
  lastMessageText: string
  lastMessageFromMe: boolean
  lastMessageType: string
}

export interface ChatMessage {
  id: string
  tenantId: string
  instanceName: string
  eventType: string
  messageType: string
  remoteJid: string
  pushName: string
  source: string
  fromMe: boolean
  quotedMessageConversation: string
  messageConversation: string
  messageDate: string | null
  createdAt: string | null
}

export interface ChatConversationListData {
  tenantId: string
  conversations: ChatConversation[]
}

export interface ChatMessageListData {
  tenantId: string
  remoteJid: string
  messages: ChatMessage[]
}
