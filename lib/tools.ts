export interface Tool {
  id: string
  name: string
  description: string
  url: string
  icon: string
  beta?: boolean
  targetBlank?: boolean
}

export const tools: Tool[] = [
  {
    id: "fichiers",
    name: "Fichiers",
    description: "Espace de stockage",
    url: "https://fichiers.suite.anct.gouv.fr",
    icon: "/icons/fichiers.svg",
    targetBlank: true,
  },
  {
    id: "docs",
    name: "Docs",
    description: "Éditeur de texte collaboratif",
    url: "https://docs.numerique.gouv.fr",
    icon: "/icons/docs.svg",
    targetBlank: true,
  },
  {
    id: "visio",
    name: "Visio",
    description: "Visioconférence et transcription",
    url: "https://visio.suite.anct.gouv.fr",
    icon: "/icons/visio.png",
    beta: true,
    targetBlank: true,
  },
  {
    id: "transcript",
    name: "Transcripts",
    description: "Transcription audio en texte",
    url: "https://transcripts.numerique.gouv.fr",
    icon: "/icons/transcript.svg",
    targetBlank: true,
  },
  {
    id: "projets",
    name: "Projets",
    description: "Gestion de projets",
    url: "https://projets.suite.anct.gouv.fr",
    icon: "/icons/projets.svg",
    targetBlank: true,
  },
  {
    id: "grist",
    name: "Grist",
    description: "Tableur et base de données",
    url: "https://grist.incubateur.anct.gouv.fr",
    icon: "/icons/grist.svg",
    targetBlank: true,
  },
  {
    id: "assistant-ia",
    name: "Assistant IA",
    description: "Agent conversationnel",
    url: "https://assistant.numerique.gouv.fr",
    icon: "/icons/ai.svg",
    beta: true,
    targetBlank: true,
  },
  {
    id: "france-transfert",
    name: "France Transfert",
    description: "Envoi de fichiers lourds",
    url: "https://francetransfert.numerique.gouv.fr",
    icon: "/icons/france-transfert.svg",
    targetBlank: true,
  },
  {
    id: "tchap",
    name: "Tchap",
    description: "Tchat interministériel",
    url: "https://tchap.gouv.fr",
    icon: "/icons/tchap.svg",
    targetBlank: true,
  },
  {
    id: "mattermost",
    name: "Mattermost",
    description: "Tchat ANCT",
    url: "https://chat.incubateur.anct.gouv.fr",
    icon: "/icons/mattermost.svg",
    targetBlank: true,
  },
]
