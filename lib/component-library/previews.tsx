"use client"

import { useState } from "react"
import { PageHeader } from "./page-header"
import { FormCard } from "./form-card"
import { BlockSelector } from "./block-selector"
import { SidebarNav } from "./sidebar-nav"
// import { AnchorNav } from "./anchor-nav" // Componente no disponible
import { ItineraryTimeline } from "./itinerary-timeline"
import { ChatPanel } from "./chat-panel"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

function BlockSelectorPreview() {
  const [selectedId, setSelectedId] = useState<string | null>("1")
  const blocks = [
    { id: "1", label: "Bloque 1" },
    { id: "2", label: "Bloque 2" },
    { id: "3", label: "Bloque 3" },
  ]
  const selectedBlock = blocks.find((b) => b.id === selectedId)

  return (
    <div className="w-full max-w-xs">
      <BlockSelector.Root>
        <BlockSelector.Trigger
          selectedLabel={selectedBlock?.label}
          onClick={() => {}}
        />
        <BlockSelector.Content>
          <BlockSelector.List>
            {blocks.map((block) => (
              <BlockSelector.Item
                key={block.id}
                isSelected={selectedId === block.id}
                onClick={() => setSelectedId(block.id)}
              >
                <BlockSelector.ItemLabel>{block.label}</BlockSelector.ItemLabel>
                {selectedId === block.id && <BlockSelector.ItemCheck />}
              </BlockSelector.Item>
            ))}
          </BlockSelector.List>
        </BlockSelector.Content>
      </BlockSelector.Root>
    </div>
  )
}

export const componentPreviews: Record<
  string,
  { component: React.ReactNode; code: string }
> = {
  "page-header": {
    component: (
      <PageHeader.Root>
        <PageHeader.Back text="Proyectos" />
        <PageHeader.Content>
          <PageHeader.Subtitle>Federación de Atletismo</PageHeader.Subtitle>
          <PageHeader.Title>Torneo Nacional 2024</PageHeader.Title>
        </PageHeader.Content>
        <PageHeader.Actions>
          <Button variant="ghost" size="sm">
            Acción
          </Button>
        </PageHeader.Actions>
      </PageHeader.Root>
    ),
    code: `import { PageHeader } from "@/lib/component-library/page-header"
import { Button } from "@/components/ui/button"

<PageHeader.Root>
  <PageHeader.Back text="Proyectos" onClick={handleBack} />
  <PageHeader.Content>
    <PageHeader.Subtitle>Federación de Atletismo</PageHeader.Subtitle>
    <PageHeader.Title>Torneo Nacional 2024</PageHeader.Title>
  </PageHeader.Content>
  <PageHeader.Actions>
    <Button variant="ghost" size="sm">
      Acción
    </Button>
  </PageHeader.Actions>
</PageHeader.Root>`,
  },
  "form-card": {
    component: (
      <FormCard.Root variant="viabilizado">
        <FormCard.Header>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-2 grow min-w-0">
                <FormCard.Title>Título del Formulario</FormCard.Title>
              </div>
              <FormCard.Action>
                <FormCard.CommentButton />
              </FormCard.Action>
            </div>
          </div>
        </FormCard.Header>
        <FormCard.Content>
          <FormCard.Field index={0}>
            <FormCard.FieldLabel>Campo 1</FormCard.FieldLabel>
            <FormCard.FieldValue>Valor del campo 1</FormCard.FieldValue>
          </FormCard.Field>
          <FormCard.Field index={1}>
            <FormCard.FieldLabel>Campo 2</FormCard.FieldLabel>
            <FormCard.FieldValue>Valor del campo 2</FormCard.FieldValue>
          </FormCard.Field>
        </FormCard.Content>
        <FormCard.Footer>
          <Button variant="ghost" className="gap-1.5 h-9 px-4">
            <MessageSquare className="size-5" />
            <span className="text-sm font-medium">Comentarios</span>
          </Button>
        </FormCard.Footer>
      </FormCard.Root>
    ),
    code: `import { FormCard } from "@/lib/component-library/form-card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

<FormCard.Root variant="viabilizado">
  <FormCard.Header>
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-2 grow min-w-0">
          <FormCard.Title>Título del Formulario</FormCard.Title>
        </div>
        <FormCard.Action>
          <FormCard.CommentButton onClick={handleComment} />
        </FormCard.Action>
      </div>
    </div>
  </FormCard.Header>
  <FormCard.Content>
    <FormCard.Field index={0}>
      <FormCard.FieldLabel>Campo 1</FormCard.FieldLabel>
      <FormCard.FieldValue>Valor del campo 1</FormCard.FieldValue>
    </FormCard.Field>
    <FormCard.Field index={1}>
      <FormCard.FieldLabel>Campo 2</FormCard.FieldLabel>
      <FormCard.FieldValue>Valor del campo 2</FormCard.FieldValue>
    </FormCard.Field>
  </FormCard.Content>
  <FormCard.Footer>
    <Button variant="ghost" className="gap-1.5 h-9 px-4">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium">Comentarios</span>
    </Button>
  </FormCard.Footer>
</FormCard.Root>`,
  },
  "block-selector": {
    component: <BlockSelectorPreview />,
    code: `import { BlockSelector } from "@/lib/component-library/block-selector"

const blocks = [
  { id: "1", label: "Bloque 1" },
  { id: "2", label: "Bloque 2" },
]
const [selectedId, setSelectedId] = React.useState<string | null>("1")
const selectedBlock = blocks.find(b => b.id === selectedId)

<BlockSelector.Root>
  <BlockSelector.Trigger
    selectedLabel={selectedBlock?.label}
    onClick={() => {}}
  />
  <BlockSelector.Content>
    <BlockSelector.List>
      {blocks.map((block) => (
        <BlockSelector.Item
          key={block.id}
          isSelected={selectedId === block.id}
          onClick={() => setSelectedId(block.id)}
        >
          <BlockSelector.ItemLabel>{block.label}</BlockSelector.ItemLabel>
          {selectedId === block.id && <BlockSelector.ItemCheck />}
        </BlockSelector.Item>
      ))}
    </BlockSelector.List>
  </BlockSelector.Content>
</BlockSelector.Root>`,
  },
  "sidebar-nav": {
    component: (
      <div className="w-60 border border-border rounded-lg overflow-hidden">
        <SidebarNav.Root>
          <SidebarNav.List>
            <SidebarNav.Item href="#" active>
              <SidebarNav.ItemLabel>Inicio</SidebarNav.ItemLabel>
            </SidebarNav.Item>
            <SidebarNav.Item href="#">
              <SidebarNav.ItemLabel>Proyectos</SidebarNav.ItemLabel>
              <SidebarNav.ItemBadge>3</SidebarNav.ItemBadge>
            </SidebarNav.Item>
            <SidebarNav.Item href="#">
              <SidebarNav.ItemLabel>Actividades</SidebarNav.ItemLabel>
            </SidebarNav.Item>
          </SidebarNav.List>
        </SidebarNav.Root>
      </div>
    ),
    code: `import { SidebarNav } from "@/lib/component-library/sidebar-nav"

<SidebarNav.Root>
  <SidebarNav.List>
    <SidebarNav.Item href="/" active>
      <SidebarNav.ItemLabel>Inicio</SidebarNav.ItemLabel>
    </SidebarNav.Item>
    <SidebarNav.Item href="/proyectos">
      <SidebarNav.ItemLabel>Proyectos</SidebarNav.ItemLabel>
      <SidebarNav.ItemBadge>3</SidebarNav.ItemBadge>
    </SidebarNav.Item>
  </SidebarNav.List>
</SidebarNav.Root>`,
  },
  // "anchor-nav": {
  //   component: (
  //     <div className="w-auto border border-border rounded-lg p-4">
  //       <AnchorNav.Root>
  //         <AnchorNav.Item active>
  //           <AnchorNav.ItemLabel>Sección 1</AnchorNav.ItemLabel>
  //         </AnchorNav.Item>
  //         <AnchorNav.Item>
  //           <AnchorNav.ItemLabel>Sección 2</AnchorNav.ItemLabel>
  //         </AnchorNav.Item>
  //         <AnchorNav.Item>
  //           <AnchorNav.ItemIcon variant="viabilizado" />
  //           <AnchorNav.ItemLabel>Sección 3</AnchorNav.ItemLabel>
  //         </AnchorNav.Item>
  //       </AnchorNav.Root>
  //     </div>
  //   ),
  //   code: `import { AnchorNav } from "@/lib/component-library/anchor-nav"

  // <AnchorNav.Root>
  //   <AnchorNav.Item active onClick={() => scrollToSection("section-1")}>
  //     <AnchorNav.ItemLabel>Sección 1</AnchorNav.ItemLabel>
  //   </AnchorNav.Item>
  //   <AnchorNav.Item onClick={() => scrollToSection("section-2")}>
  //     <AnchorNav.ItemLabel>Sección 2</AnchorNav.ItemLabel>
  //   </AnchorNav.Item>
  //   <AnchorNav.Item onClick={() => scrollToSection("section-3")}>
  //     <AnchorNav.ItemIcon variant="viabilizado" />
  //     <AnchorNav.ItemLabel>Sección 3</AnchorNav.ItemLabel>
  //   </AnchorNav.Item>
  // </AnchorNav.Root>`,
  // },
  "itinerary-timeline": {
    component: (
      <div className="w-full max-w-2xl">
        <ItineraryTimeline.Root>
          <ItineraryTimeline.Section>
            <ItineraryTimeline.SectionLabel>
              <ItineraryTimeline.SectionLabelText>Salida</ItineraryTimeline.SectionLabelText>
            </ItineraryTimeline.SectionLabel>
            <ItineraryTimeline.SectionContent>
              <ItineraryTimeline.Item>
                <ItineraryTimeline.ItemMarker showLine />
                <ItineraryTimeline.ItemContent>
                  <ItineraryTimeline.ItemCity>Ciudad A</ItineraryTimeline.ItemCity>
                  <ItineraryTimeline.ItemDate>15/04/2026</ItineraryTimeline.ItemDate>
                </ItineraryTimeline.ItemContent>
              </ItineraryTimeline.Item>
              <ItineraryTimeline.Item isLast>
                <ItineraryTimeline.ItemMarker showLine={false} />
                <ItineraryTimeline.ItemContent>
                  <ItineraryTimeline.ItemCity>Ciudad B</ItineraryTimeline.ItemCity>
                  <ItineraryTimeline.ItemDate>16/04/2026</ItineraryTimeline.ItemDate>
                </ItineraryTimeline.ItemContent>
              </ItineraryTimeline.Item>
            </ItineraryTimeline.SectionContent>
          </ItineraryTimeline.Section>
        </ItineraryTimeline.Root>
      </div>
    ),
    code: `import { ItineraryTimeline } from "@/lib/component-library/itinerary-timeline"

<ItineraryTimeline.Root>
  <ItineraryTimeline.Section>
    <ItineraryTimeline.SectionLabel>
      <ItineraryTimeline.SectionLabelText>Salida</ItineraryTimeline.SectionLabelText>
    </ItineraryTimeline.SectionLabel>
    <ItineraryTimeline.SectionContent>
      <ItineraryTimeline.Item>
        <ItineraryTimeline.ItemMarker showLine />
        <ItineraryTimeline.ItemContent>
          <ItineraryTimeline.ItemCity>Ciudad A</ItineraryTimeline.ItemCity>
          <ItineraryTimeline.ItemDate>15/04/2026</ItineraryTimeline.ItemDate>
        </ItineraryTimeline.ItemContent>
      </ItineraryTimeline.Item>
      <ItineraryTimeline.Item isLast>
        <ItineraryTimeline.ItemMarker showLine={false} />
        <ItineraryTimeline.ItemContent>
          <ItineraryTimeline.ItemCity>Ciudad B</ItineraryTimeline.ItemCity>
          <ItineraryTimeline.ItemDate>16/04/2026</ItineraryTimeline.ItemDate>
        </ItineraryTimeline.ItemContent>
      </ItineraryTimeline.Item>
    </ItineraryTimeline.SectionContent>
  </ItineraryTimeline.Section>
</ItineraryTimeline.Root>`,
  },
  "chat-panel": {
    component: (
      <div className="w-[380px] h-[500px] border border-border rounded-lg overflow-hidden">
        <ChatPanel.Root>
          <ChatPanel.Header>
            <ChatPanel.Title>Comentarios</ChatPanel.Title>
            <ChatPanel.CloseButton />
          </ChatPanel.Header>
          <ChatPanel.Messages>
            <ChatPanel.MessagesList>
              <ChatPanel.Message isOwn index={0}>
                <ChatPanel.MessageBubble isOwn>
                  <ChatPanel.MessageText>Mensaje propio</ChatPanel.MessageText>
                  <ChatPanel.MessageTimestamp>16:50</ChatPanel.MessageTimestamp>
                </ChatPanel.MessageBubble>
              </ChatPanel.Message>
              <ChatPanel.Message index={1}>
                <ChatPanel.MessageBubble>
                  <ChatPanel.MessageSender>Usuario</ChatPanel.MessageSender>
                  <ChatPanel.MessageContent>
                    <ChatPanel.MessageText>Mensaje de otro usuario</ChatPanel.MessageText>
                  </ChatPanel.MessageContent>
                  <ChatPanel.MessageTimestamp>17:04</ChatPanel.MessageTimestamp>
                </ChatPanel.MessageBubble>
              </ChatPanel.Message>
            </ChatPanel.MessagesList>
          </ChatPanel.Messages>
          <ChatPanel.Footer>
            <ChatPanel.InputGroup>
              <ChatPanel.AttachmentButton />
              <ChatPanel.Input />
              <ChatPanel.SendButton />
            </ChatPanel.InputGroup>
          </ChatPanel.Footer>
        </ChatPanel.Root>
      </div>
    ),
    code: `import { ChatPanel } from "@/lib/component-library/chat-panel"

<ChatPanel.Root>
  <ChatPanel.Header>
    <ChatPanel.Title>Comentarios</ChatPanel.Title>
    <ChatPanel.CloseButton onClick={handleClose} />
  </ChatPanel.Header>
  <ChatPanel.Messages>
    <ChatPanel.MessagesList>
      <ChatPanel.Message isOwn index={0}>
        <ChatPanel.MessageBubble isOwn>
          <ChatPanel.MessageText>Mensaje propio</ChatPanel.MessageText>
          <ChatPanel.MessageTimestamp>16:50</ChatPanel.MessageTimestamp>
        </ChatPanel.MessageBubble>
      </ChatPanel.Message>
      <ChatPanel.Message index={1}>
        <ChatPanel.MessageBubble>
          <ChatPanel.MessageSender>Usuario</ChatPanel.MessageSender>
          <ChatPanel.MessageContent>
            <ChatPanel.MessageText>Mensaje de otro usuario</ChatPanel.MessageText>
          </ChatPanel.MessageContent>
          <ChatPanel.MessageTimestamp>17:04</ChatPanel.MessageTimestamp>
        </ChatPanel.MessageBubble>
      </ChatPanel.Message>
    </ChatPanel.MessagesList>
  </ChatPanel.Messages>
  <ChatPanel.Footer>
    <ChatPanel.InputGroup>
      <ChatPanel.AttachmentButton />
      <ChatPanel.Input value={inputValue} onChange={handleInputChange} />
      <ChatPanel.SendButton onClick={handleSend} />
    </ChatPanel.InputGroup>
  </ChatPanel.Footer>
</ChatPanel.Root>`,
  },
  "estilos-globales": {
    component: (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Tokens de Color</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-primary" />
              <p className="text-sm font-medium">Primary</p>
              <code className="text-xs text-muted-foreground">--primary</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-secondary" />
              <p className="text-sm font-medium">Secondary</p>
              <code className="text-xs text-muted-foreground">--secondary</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-accent" />
              <p className="text-sm font-medium">Accent</p>
              <code className="text-xs text-muted-foreground">--accent</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-destructive" />
              <p className="text-sm font-medium">Destructive</p>
              <code className="text-xs text-muted-foreground">--destructive</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-muted" />
              <p className="text-sm font-medium">Muted</p>
              <code className="text-xs text-muted-foreground">--muted</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-card border border-border" />
              <p className="text-sm font-medium">Card</p>
              <code className="text-xs text-muted-foreground">--card</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg bg-background border border-border" />
              <p className="text-sm font-medium">Background</p>
              <code className="text-xs text-muted-foreground">--background</code>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-16 rounded-lg border-2 border-border" />
              <p className="text-sm font-medium">Border</p>
              <code className="text-xs text-muted-foreground">--border</code>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Uso en Tailwind</h3>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">
              {`// Usar tokens en clases Tailwind
<div className="bg-primary text-primary-foreground">
  Contenido
</div>

// O con CSS variables
<div style={{ backgroundColor: 'hsl(var(--primary))' }}>
  Contenido
</div>`}
            </code>
          </div>
        </div>
      </div>
    ),
    code: "// Ver código completo en la pestaña Code",
  },
}


