import { useContent } from '../content/useContent'
import type { Channel } from '../content/schema'
import { CopyButton } from '../components/ui/CopyButton'
import { Icon } from '../components/ui/Icon'
import { PageHead } from '../components/ui/PageHead'
import { Rise } from '../components/ui/Rise'

function ChannelCard({ channel }: { channel: Channel }) {
  const inner = (
    <div className="flex h-full flex-col bg-raised p-8 transition-colors group-hover:bg-edge">
      <div className="flex items-center gap-3">
        <Icon name={channel.icon} className="text-[18px] text-accent" />
        <span className="kicker-mute">{channel.label}</span>
      </div>
      <p className="mt-5 break-all text-[19px] font-semibold text-white">{channel.value}</p>
      {channel.note ? <p className="copy mt-3 text-[14px]">{channel.note}</p> : null}
      <div className="mt-auto pt-6">
        <CopyButton value={channel.value} />
      </div>
    </div>
  )

  if (!channel.href) return <div className="h-full">{inner}</div>

  return (
    <a
      href={channel.href}
      target={/^https?:/i.test(channel.href) ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group block h-full"
    >
      {inner}
    </a>
  )
}

export function Contact() {
  const { contact } = useContent()
  const { intro, channels } = contact

  return (
    <div className="pb-28">
      <PageHead kicker={intro.label} title={intro.title} lede={intro.lede} />

      {channels.length > 0 ? (
        <section className="page">
          <div className="grid gap-4 md:grid-cols-3">
            {channels.map((channel, index) => (
              <Rise key={channel.id || channel.label} delay={index * 0.05}>
                <ChannelCard channel={channel} />
              </Rise>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
