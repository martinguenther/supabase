import { Activity, BookOpen, HelpCircle, Mail, Wrench } from 'lucide-react'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import SVG from 'react-inlinesvg'

import { SupportLink } from 'components/interfaces/Support/SupportLink'
import { ButtonTooltip } from 'components/ui/ButtonTooltip'
import { useSendEventMutation } from 'data/telemetry/send-event-mutation'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'
import { DOCS_URL } from 'lib/constants'
import { useAiAssistantStateSnapshot } from 'state/ai-assistant-state'
import {
  AiIconAnimation,
  Button,
  ButtonGroup,
  ButtonGroupItem,
  IconDiscord,
  Popover,
  PopoverContent_Shadcn_,
  PopoverTrigger_Shadcn_,
  Popover_Shadcn_,
} from 'ui'

export const HelpPopover = () => {
  const router = useRouter()
  const { data: project } = useSelectedProjectQuery()
  const { data: org } = useSelectedOrganizationQuery()
  const snap = useAiAssistantStateSnapshot()

  const { mutate: sendEvent } = useSendEventMutation()

  const projectRef = project?.parent_project_ref ?? (router.query.ref as string | undefined)

  const IS_PLATFORM = true

  return (
    <Popover_Shadcn_>
      <PopoverTrigger_Shadcn_ asChild>
        <ButtonTooltip
          id="help-popover-button"
          type="text"
          className="rounded-none w-[32px] h-[30px] group"
          icon={
            <HelpCircle
              size={18}
              strokeWidth={1.5}
              className="!h-[18px] !w-[18px] text-foreground-light group-hover:text-foreground"
            />
          }
          tooltip={{ content: { side: 'bottom', text: 'Help' } }}
          onClick={() => {
            sendEvent({
              action: 'help_button_clicked',
              groups: { project: project?.ref, organization: org?.slug },
            })
          }}
        />
      </PopoverTrigger_Shadcn_>
      <PopoverContent_Shadcn_ className="w-[400px] space-y-4 p-0 py-5" align="end" side="bottom">
        <div className="mb-5 px-5">
          <div className="mb-4 flex flex-col gap-1">
            <h5 className="text-foreground">Need help with your project?</h5>
            <p className="text-sm text-foreground-lighter text-balance">
              Start with our docs or community. Most questions are answered there in minutes.
            </p>
          </div>
        </div>

        <div className="px-5">
          <ButtonGroup className="w-full">
            {projectRef && (
              <ButtonGroupItem
                size="tiny"
                icon={<AiIconAnimation allowHoverEffect size={14} />}
                onClick={() => {
                  snap.newChat({
                    name: 'Support',
                    open: true,
                    initialInput: `I need help with my project`,
                    suggestions: {
                      title:
                        'I can help you with your project, here are some example prompts to get you started:',
                      prompts: [
                        {
                          label: 'Database Health',
                          description: 'Summarise my database health and performance',
                        },
                        {
                          label: 'Debug Logs',
                          description: 'View and debug my edge function logs',
                        },
                        {
                          label: 'RLS Setup',
                          description: 'Implement row level security for my tables',
                        },
                      ],
                    },
                  })
                }}
              >
                Supabase Assistant
              </ButtonGroupItem>
            )}
            <ButtonGroupItem size="tiny" icon={<BookOpen strokeWidth={1.5} size={14} />} asChild>
              <a href={`${DOCS_URL}/`} target="_blank" rel="noreferrer">
                Docs
              </a>
            </ButtonGroupItem>
            <ButtonGroupItem size="tiny" icon={<Wrench strokeWidth={1.5} size={14} />} asChild>
              <a
                href={`${DOCS_URL}/guides/troubleshooting?products=platform`}
                target="_blank"
                rel="noreferrer"
              >
                Troubleshooting
              </a>
            </ButtonGroupItem>
            <ButtonGroupItem size="tiny" icon={<Activity strokeWidth={1.5} size={14} />} asChild>
              <a href="https://status.supabase.com/" target="_blank" rel="noreferrer">
                Supabase status
              </a>
            </ButtonGroupItem>
            <ButtonGroupItem size="tiny" icon={<Mail strokeWidth={1.5} size={14} />}>
              <SupportLink queryParams={{ projectRef }}>Contact support</SupportLink>
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
        <Popover.Separator />
        <div className="mb-4 space-y-2">
          <div className="mb-4 px-5 flex flex-col gap-1">
            <h5 className="text-foreground">Community support</h5>
            <p className="text-sm text-foreground-lighter text-balance">
              Our Discord community contains many experienced developers. They may be able to
              provide guidance and support with code-related issues.
            </p>
          </div>
          <div className="px-5">
            <div
              className="relative space-y-2 overflow-hidden rounded px-5 py-4 pb-12 shadow-md"
              style={{ background: '#404EED' }}
            >
              <a
                href="https://discord.supabase.com"
                target="_blank"
                rel="noreferrer"
                className="group dark block cursor-pointer"
              >
                <Image
                  className="absolute left-0 top-0 opacity-50 transition-opacity group-hover:opacity-40"
                  src={`${router.basePath}/img/support/discord-bg-small.jpg`}
                  layout="fill"
                  objectFit="cover"
                  alt="Discord illustration"
                />
                <Button
                  type="secondary"
                  size="tiny"
                  icon={<SVG src={`${router.basePath}/img/discord-icon.svg`} className="h-4 w-4" />}
                >
                  <span style={{ color: '#404EED' }}>Join us on Discord</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </PopoverContent_Shadcn_>
    </Popover_Shadcn_>
  )
}
