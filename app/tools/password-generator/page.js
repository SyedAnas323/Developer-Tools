'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?',
};

const LENGTH_STEPS = [
  'Choose the length based on the account risk level.',
  'Select the character types you want to include.',
  'Generate a password using secure random selection.',
  'Copy it and store it in a password manager if needed.',
];

const SECURITY_BASICS = [
  {
    title: 'Password Entropy',
    text: 'Entropy measures how hard a password is to guess. More possible combinations and a longer length usually mean higher entropy and better resistance to guessing attacks.',
  },
  {
    title: 'Brute-Force Attacks',
    text: 'A brute-force attack tries many combinations until the correct password is found. Longer passwords with mixed character sets take much more time to crack.',
  },
  {
    title: 'Cracking Methods',
    text: 'Attackers also use dictionary attacks, hybrid attacks, and credential stuffing when users reuse passwords across services.',
  },
];

const BENEFITS = [
  'Creates passwords that are more random than human memory usually produces.',
  'Helps users avoid predictable words, dates, and repeated patterns.',
  'Makes it easier to build strong passwords for different account types.',
  'Supports good password hygiene when combined with a password manager.',
  'Reduces the chance of repeating the same password across multiple sites.',
];

const MISTAKES = [
  {
    title: 'Reusing Passwords',
    text: 'If one site is breached, reused passwords can open the door to other accounts because attackers try the same login elsewhere.',
  },
  {
    title: 'Short Passwords',
    text: 'Short passwords have fewer combinations, so they are much easier to test with modern cracking tools.',
  },
  {
    title: 'Predictable Passwords',
    text: 'Names, keyboard patterns, repeated digits, and common phrases are simple for attackers to guess.',
  },
  {
    title: 'Personal Information',
    text: 'Birthdays, pet names, company names, and other personal data should not appear in passwords.',
  },
];

const CHARACTERISTICS = [
  'At least 12 to 16 characters for everyday accounts.',
  'A mix of uppercase and lowercase letters, numbers, and symbols when supported.',
  'No dictionary words that can be guessed quickly.',
  'No personal details or repeated keyboard patterns.',
  'Different passwords for each important account.',
];

const PASSWORD_LENGTH_ROWS = [
  { length: '8-10 characters', level: 'Weak for high-risk accounts', notes: 'Only acceptable for low-risk temporary use.' },
  { length: '12 characters', level: 'Moderate', notes: 'Better than short passwords, but still not ideal for sensitive accounts.' },
  { length: '14-16 characters', level: 'Strong', notes: 'Good balance for most personal and business logins.' },
  { length: '18+ characters', level: 'Very strong', notes: 'Recommended for admin accounts, vaults, and highly sensitive systems.' },
];

const COMPARISON_ROWS = [
  { feature: 'Security', generator: 'Higher randomness and less predictability', manual: 'Often easier to guess or reuse' },
  { feature: 'Uniqueness', generator: 'Can create a new password every time', manual: 'People often repeat familiar patterns' },
  { feature: 'Complexity', generator: 'Can include letters, numbers, and symbols automatically', manual: 'Complexity tends to be inconsistent' },
  { feature: 'Predictability', generator: 'Very low when generated with secure randomness', manual: 'Higher because humans favor memorable patterns' },
];

const RELATED_TOOLS = [
  { href: '/tools/word-counter', label: 'Word Counter' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/json-formatter', label: 'JSON Formatter' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/background-remover', label: 'Background Remover' },
];

const FAQS = [
  [
    'What is a password generator?',
    'A password generator is a tool that creates random password strings so users can make stronger and less predictable login credentials.',
  ],
  [
    'What makes a strong password?',
    'A strong password is long, random, unique, and free from personal details or common words.',
  ],
  [
    'Why is password reuse dangerous?',
    'If one website is breached, reused passwords can be tried on other services through credential stuffing.',
  ],
  [
    'How does a password generator work?',
    'It picks characters from selected sets and combines them using secure randomness instead of human guesswork.',
  ],
  [
    'What is password entropy?',
    'Password entropy is a measurement of how difficult a password is to guess based on its length and character variety.',
  ],
  [
    'How long should my password be?',
    'Most accounts should use at least 12 to 16 characters, while high-risk accounts are better with 18 or more.',
  ],
  [
    'Should I include symbols in every password?',
    'Symbols can improve complexity, but length and uniqueness are still the biggest factors in security.',
  ],
  [
    'Can password generators be used for businesses?',
    'Yes. Businesses use them to create account credentials that support policy compliance and reduce reuse risk.',
  ],
  [
    'Do I still need a password manager?',
    'Yes. A password manager helps store unique passwords safely so you do not need to memorize every one.',
  ],
  [
    'What is brute-force cracking?',
    'Brute force is an attack method that tests many combinations until the correct password is found.',
  ],
  [
    'What is credential stuffing?',
    'Credential stuffing uses leaked username and password pairs from one breach to try logins on other sites.',
  ],
  [
    'Is multi-factor authentication important?',
    'Yes. MFA adds a second checkpoint that helps protect accounts even if the password is exposed.',
  ],
  [
    'Can I use this generator on mobile?',
    'Yes. The tool works in modern mobile browsers as well as desktop browsers.',
  ],
  [
    'Are generated passwords stored?',
    'No. The password is generated in the browser and is not intended for long-term storage by the tool.',
  ],
  [
    'What is the safest way to use a generated password?',
    'Copy it into a trusted password manager and enable multi-factor authentication whenever possible.',
  ],
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row) => (
              <tr key={row.feature || row.length} className="align-top">
                {Object.values(row).map((value, index) => (
                  <td
                    key={`${value}-${index}`}
                    className={`px-5 py-4 text-slate-600 ${index === 0 ? 'font-medium text-slate-900' : ''}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function secureRandomInt(max) {
  if (max <= 0) return 0;

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.getRandomValues) {
    return Math.floor(Math.random() * max);
  }

  const uint32 = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;

  while (true) {
    cryptoObj.getRandomValues(uint32);
    if (uint32[0] < limit) {
      return uint32[0] % max;
    }
  }
}

function shuffleCharacters(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = secureRandomInt(i + 1);
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function strengthFromEntropy(bits) {
  if (bits < 40) return 'Weak';
  if (bits < 60) return 'Moderate';
  if (bits < 80) return 'Strong';
  return 'Very strong';
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const activeCharsets = useMemo(() => {
    const next = [];
    if (useUpper) next.push(CHARSETS.upper);
    if (useLower) next.push(CHARSETS.lower);
    if (useNumbers) next.push(CHARSETS.numbers);
    if (useSymbols) next.push(CHARSETS.symbols);
    return next;
  }, [useUpper, useLower, useNumbers, useSymbols]);

  const pool = useMemo(() => activeCharsets.join(''), [activeCharsets]);
  const entropyBits = useMemo(
    () => (pool ? Math.log2(pool.length) * length : 0),
    [pool, length]
  );
  const strength = strengthFromEntropy(entropyBits);

  const generatePassword = () => {
    if (!activeCharsets.length) {
      setError('Select at least one character type.');
      return;
    }

    if (length < activeCharsets.length) {
      setError(`Length must be at least ${activeCharsets.length} for the selected character sets.`);
      return;
    }

    const required = activeCharsets.map((set) => set[secureRandomInt(set.length)]);
    const remaining = Array.from({ length: length - required.length }, () => pool[secureRandomInt(pool.length)]);
    const finalPassword = shuffleCharacters([...required, ...remaining]).join('');

    setPassword(finalPassword);
    setCopied(false);
    setError('');
  };

  const copyPassword = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy failed. Please copy the password manually.');
    }
  };

  const regen = () => {
    generatePassword();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Password Security Tool
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              Free Password Generator
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Create strong passwords online with secure randomness, custom length, and character
              controls. This password generator is built for everyday account security, business
              policies, and fast one-off password creation when you need a unique login instantly.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Password Length
                  </span>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={length}
                      onChange={(event) => setLength(Number(event.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <span className="min-w-[2.5rem] text-right text-lg font-semibold text-slate-900">
                      {length}
                    </span>
                  </div>
                </label>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Security Level
                  </span>
                  <p className="mt-3 text-2xl font-bold text-blue-700">{strength}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Approx. entropy: {entropyBits.toFixed(0)} bits
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ['Uppercase letters', useUpper, setUseUpper],
                  ['Lowercase letters', useLower, setUseLower],
                  ['Numbers', useNumbers, setUseNumbers],
                  ['Symbols', useSymbols, setUseSymbols],
                ].map(([label, checked, setter]) => (
                  <label
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => setter(event.target.checked)}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Generate Password
                </button>
                <button
                  type="button"
                  onClick={regen}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Regenerate
                </button>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Generated Password
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="break-all font-mono text-lg leading-8 text-slate-900">
                  {password || 'Click Generate Password to create a secure password.'}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Entropy
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{entropyBits.toFixed(0)} bits</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Pool Size
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{pool.length} chars</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Copy Status
                  </p>
                  <p className="mt-2 text-xl font-bold text-blue-700">{copied ? 'Copied' : 'Ready'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={copyPassword}
                  disabled={!password}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Copy Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLength(16);
                    setUseUpper(true);
                    setUseLower(true);
                    setUseNumbers(true);
                    setUseSymbols(true);
                    setPassword('');
                    setCopied(false);
                    setError('');
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is A Password Generator?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A password generator is a secure password tool that creates random password strings for
            online accounts. Instead of relying on names, birthdays, or familiar words, it builds a
            password from character sets and random selection. That makes the result harder to
            guess, harder to reuse, and much better suited to modern account security.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is A Strong Password?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A strong password is long, unique, and difficult to predict. It usually mixes
                uppercase and lowercase letters, numbers, and symbols, while avoiding words or
                patterns that people can guess easily.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How Password Generators Work</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A generator chooses characters from the sets you allow, then combines them with
                secure randomness. Good generators also avoid predictable sequences and make each
                password different from the last one.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why Password Security Matters</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Weak passwords are one of the most common reasons accounts get compromised. A better
                password lowers the chance of unauthorized access, especially when paired with MFA.
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              AI Overview Summary
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The safest approach is simple: use a random password generator, create a unique
              password for every important account, store it in a password manager, and turn on MFA
              wherever possible.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Generate A Secure Password"
              description="A secure password becomes much easier to create when you follow a repeatable workflow."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {LENGTH_STEPS.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Using A Password Generator"
              description="Random generation helps users avoid the habits that make passwords easy to crack."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {BENEFITS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Basics"
            title="Password Security Basics"
            description="Good password security starts with understanding entropy, attack methods, and how attackers actually test passwords."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {SECURITY_BASICS.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">How Password Cracking Usually Happens</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600">
              <li>Brute-force attacks try every possible combination until one works.</li>
              <li>Dictionary attacks test common words, phrases, and known leaked passwords.</li>
              <li>Hybrid attacks mix words with numbers and symbols to catch common human patterns.</li>
              <li>Credential stuffing uses leaked username and password pairs from other breaches.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mistakes"
              title="Common Password Mistakes"
              description="These habits are the reason many passwords fail even before a breach occurs."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {MISTAKES.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Traits"
              title="Characteristics Of Strong Passwords"
              description="Strong passwords share a few practical characteristics that make them harder to guess and easier to defend."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {CHARACTERISTICS.map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Length"
              title="Password Length Recommendations"
              description="Length is one of the biggest factors in password resistance, especially when the password is random."
            />
            <div className="mt-6">
              <DataTable
                columns={['Password Length', 'Estimated Security Level', 'Notes']}
                rows={PASSWORD_LENGTH_ROWS}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Complexity"
              title="Password Complexity Explained"
              description="Complexity is helpful, but length and randomness usually matter even more than symbols alone."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Password complexity is the mix of character types inside a password. A password with
              uppercase letters, lowercase letters, numbers, and symbols is harder to brute-force
              than a simple word. However, a long random password without symbols can still be very
              strong because the possible combinations increase dramatically with length.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The best results come from combining length, randomness, and uniqueness instead of
              relying on one feature alone. That is why password generators are better than human
              memory when the goal is account protection.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="Password Generator vs Human-Created Passwords"
            description="Human-created passwords usually reflect memory shortcuts, while generators focus on randomness and uniqueness."
          />
          <div className="mt-6">
            <DataTable
              columns={['Feature', 'Password Generator', 'Manual Password']}
              rows={COMPARISON_ROWS}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Managers"
              title="Password Managers And Password Generators"
              description="A password generator creates the password. A password manager stores and fills it later."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Password managers improve security because they let you use a different password for
              every account without remembering each one manually. When paired with a password
              generator, they create a secure workflow: generate a random password, store it safely,
              and reuse nothing across sites.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="MFA"
              title="Multi-Factor Authentication (MFA)"
              description="MFA adds a second layer of protection so one leaked password does not immediately unlock the account."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              MFA improves account protection by requiring something in addition to the password,
              such as a one-time code, device prompt, or security key. Even a strong password should
              be combined with MFA because breaches, phishing, and malware can still expose login
              credentials.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Business"
              title="Password Security For Businesses"
              description="Businesses need password policies because one weak account can become a path into the larger system."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Strong password rules reduce the chance of reuse, weak admin access, and slow incident
              recovery. Businesses typically require longer passwords, password managers, MFA,
              periodic review of privileged accounts, and policies that limit common patterns.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Individuals"
              title="Password Security For Individuals"
              description="Individuals can improve security quickly by changing habits around reuse and predictable patterns."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Personal accounts are safer when every important login has a unique password, a
              password manager stores the credentials, and MFA is enabled wherever possible. The
              most important habit change is to stop reusing one memorable password everywhere.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Length And Risk"
            title="Why Strong Passwords Matter"
            description="Password strength matters because attackers do not need to know you personally if they can guess or reuse a weak login."
          />
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Strong passwords lower the chance of brute-force success, reduce damage from leaked
            databases, and make credential stuffing less effective. They are especially important for
            email accounts, password managers, admin dashboards, payment tools, and cloud systems
            because those accounts often protect everything else.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            If an attacker gets one reused password, they may be able to access multiple services.
            That is why password generation, password management, and MFA work best together as a
            security stack.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
            <SectionHeading
              eyebrow="Summary"
              title="Password Generator Best Practice"
              description="Use a random generator, store the result securely, and never reuse the same password across accounts."
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <p className="text-sm leading-7 text-slate-600">
              The best password workflow is simple: generate a password that is long enough, store it
              in a trusted password manager, and enable MFA. For important accounts, avoid human-made
              patterns and use unique credentials every time.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="These answers are concise enough for quick readers and detailed enough for AI search extraction."
          />
          <div className="mt-6 space-y-4">
            {FAQS.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Related Tools"
            title="Related Tools"
            description="Continue the workflow with tools that support writing, documents, images, and security tasks."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {RELATED_TOOLS.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Strong Password Generator Free - Create Secure Passwords Instantly | MyToolsHub',
            url: 'https://toolshub.cyphersol.com/tools/password-generator',
            description:
              'Generate strong, random, and secure passwords instantly. Customize length, symbols, numbers, and uppercase. 100% free, no signup, never stored.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'MyToolsHub',
              url: 'https://toolshub.cyphersol.com',
            },
            inLanguage: 'en',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Password Generator',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: 'https://toolshub.cyphersol.com/tools/password-generator',
            description:
              'Generate strong random passwords online for free with custom length and character controls.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://toolshub.cyphersol.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Tools',
                item: 'https://toolshub.cyphersol.com/tools',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Password Generator',
                item: 'https://toolshub.cyphersol.com/tools/password-generator',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How To Generate A Secure Password',
            totalTime: 'PT1M',
            step: LENGTH_STEPS.map((step) => ({
              '@type': 'HowToStep',
              name: step,
              text: step,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
