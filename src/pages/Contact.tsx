import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Page } from '../components/layout/Page'
import { Reveal } from '../components/motion/Reveal'
import { SplitHeading } from '../components/motion/SplitHeading'
import { Img } from '../components/ui/Img'
import { site } from '../data/site'

type Fields = { name: string; email: string; company: string; role: string; message: string }
const empty: Fields = { name: '', email: '', company: '', role: '', message: '' }
const roles = ['Business owner', 'Management team', 'Independent sponsor', 'Limited partner', 'Other']

export default function Contact() {
  const [fields, setFields] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [opened, setOpened] = useState(false)

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!fields.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Please enter a valid email address.'
    if (!fields.message.trim()) next.message = 'Please tell us a little about your company or opportunity.'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(`field-${Object.keys(next)[0]}`)?.focus()
      return
    }
    // Honest by design: this template has no backend, so the message is handed to the visitor's own email app.
    const subject = `Introduction from ${fields.name}${fields.company ? `, ${fields.company}` : ''}`
    const body = [
      fields.message,
      '',
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      fields.company && `Organization: ${fields.company}`,
      fields.role && `I am a: ${fields.role}`,
    ]
      .filter((l) => l !== '')
      .join('\n')
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }

  return (
    <Page title="Contact" description="Get in touch with the Tallwater Growth Partners team in Milwaukee, Wisconsin.">
      <section data-header="dark" className="grain relative bg-ink text-ivory">
        <div className="container-x grid-12 gap-y-16 pb-24 pt-40 sm:pt-48 lg:pb-32">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow text-sky">Contact</p>
            <SplitHeading as="h1" trigger="intro" delay={0.2} className="display-xl mt-8 max-w-[10ch]">
              Let’s talk about what’s next.
            </SplitHeading>
            <Reveal variant="fade" className="mt-10">
              <p className="lede max-w-md text-ivory/75">
                Tell us a little about your company or your deal. A partner reads every message and replies within two business
                days.
              </p>
            </Reveal>

            <Reveal variant="stagger" as="ul" className="mt-14 divide-y divide-ivory/10 border-y border-ivory/10">
              <li>
                <a href={site.contact.phoneHref} className="group flex items-center gap-5 py-5">
                  <Phone className="size-4 text-sky" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-serif text-2xl font-light">
                    <span className="u-link">{site.contact.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="group flex items-center gap-5 py-5">
                  <Mail className="size-4 shrink-0 text-sky" strokeWidth={1.5} aria-hidden="true" />
                  <span className="break-all font-serif text-[clamp(1.1rem,2vw,1.5rem)] font-light">
                    <span className="u-link">{site.contact.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={site.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-5 py-5"
                >
                  <MapPin className="mt-1.5 size-4 text-sky" strokeWidth={1.5} aria-hidden="true" />
                  <span>
                    <span className="block font-serif text-xl font-light leading-snug">
                      {site.contact.street}
                      <br />
                      {site.contact.city}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sky">
                      <span className="u-link-static">Get directions</span>
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                  </span>
                </a>
              </li>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal variant="rise" className="bg-paper p-6 text-ink sm:p-10">
              <form onSubmit={submit} noValidate aria-describedby="form-note" className="on-light">
                <h2 className="display-s">Start a conversation</h2>
                <p id="form-note" className="mt-3 text-sm leading-relaxed text-slate">
                  This form opens your email application with a message addressed to {site.contact.email}. Nothing is stored or
                  sent by this website.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Field
                    label="Name"
                    name="name"
                    value={fields.name}
                    onChange={set('name')}
                    error={errors.name}
                    required
                    autoComplete="name"
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={set('email')}
                    error={errors.email}
                    required
                    autoComplete="email"
                  />
                  <Field
                    label="Organization"
                    name="company"
                    value={fields.company}
                    onChange={set('company')}
                    autoComplete="organization"
                  />
                  <SelectField label="I am a" name="role" value={fields.role} onChange={set('role')} options={roles} />
                  <div className="sm:col-span-2">
                    <Field
                      label="How can we help?"
                      name="message"
                      value={fields.message}
                      onChange={set('message')}
                      error={errors.message}
                      required
                      multiline
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="inline-flex h-13 items-center gap-3 rounded-full bg-ink pl-6 pr-2.5 text-sm font-semibold text-ivory transition-colors duration-500 hover:bg-teal"
                  >
                    Compose email
                    <span className="grid size-9 place-items-center rounded-full bg-ivory/10" aria-hidden="true">
                      <Mail className="size-4" strokeWidth={1.6} />
                    </span>
                  </button>
                  <p className="text-xs text-slate" aria-live="polite">
                    {opened
                      ? 'Your email application should now be open. If not, email us directly.'
                      : 'Fields marked * are required.'}
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <section data-header="light" className="on-light bg-ivory py-20 text-ink sm:py-28">
        <div className="container-x grid-12 items-center gap-y-12">
          <Reveal variant="clip-x" className="relative col-span-12 aspect-[16/9] overflow-hidden md:col-span-7">
            <Img
              base="/media/hero/contact"
              alt="A quiet meeting room with a long table and tall windows"
              sizes="(min-width: 768px) 58vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Reveal>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="eyebrow text-teal">Visiting Milwaukee?</p>
            <p className="display-s mt-5">Coffee is on us, and the view of the harbor is free.</p>
            <p className="body-copy mt-5 text-ink/70">
              Our office is a short walk from the lakefront. Let us know you are coming and we will have a partner free to meet
              you.
            </p>
            <a
              href={site.contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal"
            >
              <span className="u-link-static">Get directions</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </Page>
  )
}

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  type?: string
  multiline?: boolean
  autoComplete?: string
}

const inputCls =
  'mt-2 block w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/35 transition-colors focus:border-teal focus:outline-none focus:ring-0 aria-[invalid=true]:border-red-700'

function Field({ label, name, value, onChange, error, required, type = 'text', multiline, autoComplete }: FieldProps) {
  const errId = useId()
  const common = {
    id: `field-${name}`,
    name,
    value,
    required,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
    className: inputCls,
  }
  return (
    <div>
      <label htmlFor={`field-${name}`} className="eyebrow text-slate">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={5} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y`} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errId} className="mt-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label htmlFor={`field-${name}`} className="eyebrow text-slate">
        {label}
      </label>
      <select
        id={`field-${name}`}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} cursor-pointer`}
      >
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
