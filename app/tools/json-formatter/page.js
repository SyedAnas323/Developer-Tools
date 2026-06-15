'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const SAMPLE_SNIPPETS = [
  {
    label: 'User Profile',
    value: JSON.stringify(
      {
        name: 'Ayesha Khan',
        role: 'Frontend Developer',
        active: true,
        skills: ['React', 'Next.js', 'TypeScript'],
      },
      null,
      2
    ),
  },
  {
    label: 'API Response',
    value: JSON.stringify(
      {
        success: true,
        status: 200,
        data: {
          id: 101,
          title: 'Example payload',
          tags: ['json', 'api', 'formatting'],
        },
      },
      null,
      2
    ),
  },
  {
    label: 'App Config',
    value: JSON.stringify(
      {
        env: 'production',
        features: {
          analytics: true,
          cache: false,
          retries: 3,
        },
      },
      null,
      2
    ),
  },
];

const JSON_STRUCTURE_ROWS = [
  {
    element: 'Object',
    description: 'A set of key-value pairs enclosed in curly braces.',
    example: '{"name":"Sara","active":true}',
  },
  {
    element: 'Array',
    description: 'An ordered list of values enclosed in square brackets.',
    example: '["json","api","frontend"]',
  },
  {
    element: 'Key-Value Pair',
    description: 'A property name and its associated value inside an object.',
    example: '"name":"Sara"',
  },
  {
    element: 'Nested JSON',
    description: 'JSON data that contains other objects or arrays inside parent structures.',
    example: '{"user":{"id":1,"roles":["admin","editor"]}}',
  },
];

const FORMATTER_VS_VALIDATOR_ROWS = [
  {
    feature: 'Formatting',
    formatter: 'Beautifies JSON with indentation and spacing',
    validator: 'Checks whether formatting can be parsed',
  },
  {
    feature: 'Validation',
    formatter: 'May show an error if JSON is invalid',
    validator: 'Primary job is to find JSON syntax problems',
  },
  {
    feature: 'Readability',
    formatter: 'Improves readability for humans',
    validator: 'Does not focus on visual presentation',
  },
  {
    feature: 'Debugging',
    formatter: 'Helps inspect nested structures clearly',
    validator: 'Helps spot missing commas, quotes, or brackets',
  },
  {
    feature: 'Output',
    formatter: 'Pretty-printed JSON or minified JSON',
    validator: 'Pass/fail result with error details',
  },
];

const COMMON_ERROR_ROWS = [
  {
    error: 'Missing Brackets',
    example: '{"name":"John"',
    fix: 'Add the closing brace or bracket so the structure becomes complete.',
  },
  {
    error: 'Invalid Quotes',
    example: "{'name':'John'}",
    fix: 'Use double quotes for JSON keys and string values.',
  },
  {
    error: 'Trailing Commas',
    example: '{"a":1,}',
    fix: 'Remove the final comma before the closing brace or bracket.',
  },
  {
    error: 'Incorrect Data Types',
    example: '{"active":"true"}',
    fix: 'Use the right JSON type, such as boolean true instead of a quoted string.',
  },
];

const CONTENT_LENGTH_ROWS = [
  { type: 'API payloads', recommendation: 'Keep only the fields you need and format clearly for debugging.' },
  { type: 'Frontend config files', recommendation: 'Use readable formatting so teams can inspect settings quickly.' },
  { type: 'Mobile app data', recommendation: 'Structure data compactly and validate before release.' },
  { type: 'Logs and events', recommendation: 'Validate and normalize event objects before sending them downstream.' },
];

const JSON_FOR_USAGE_CARDS = [
  {
    title: 'How Developers Use JSON',
    text: 'Developers use JSON to store settings, send request payloads, read responses, and pass structured data between services.',
  },
  {
    title: 'How APIs Use JSON',
    text: 'APIs usually accept JSON request bodies and return JSON responses because the format is lightweight and widely supported.',
  },
  {
    title: 'How Frontend Apps Use JSON',
    text: 'Frontend applications use JSON to load content, configure features, and keep state synchronized with backend systems.',
  },
  {
    title: 'How Backend Systems Exchange JSON',
    text: 'Backend systems exchange JSON through HTTP requests, queues, and service-to-service integrations for fast interoperability.',
  },
];

const JSON_BEST_PRACTICES = [
  'Use double quotes around keys and string values.',
  'Keep objects and arrays consistently indented.',
  'Validate JSON before using it in production.',
  'Avoid trailing commas, comments, and unsupported syntax.',
  'Use meaningful key names that describe the data clearly.',
  'Format JSON before sharing it with teammates or API consumers.',
];

const JSON_MISTAKES = [
  'Mixing single quotes and double quotes inside the same JSON block.',
  'Forgetting a comma between two properties or array items.',
  'Using words like yes or no instead of booleans true and false.',
  'Confusing null with an empty string or missing field.',
  'Leaving an extra comma after the final item.',
];

const RELATED_TOOLS = [
  { href: '/tools/password-generator', label: 'Password Generator' },
  { href: '/tools/word-counter', label: 'Word Counter' },
  { href: '/tools/qr-generator', label: 'QR Generator' },
  { href: '/tools/pdf-compressor', label: 'PDF Compressor' },
  { href: '/tools/pdf-merge', label: 'PDF Merge' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/image-format-converter', label: 'Image Format Converter' },
];

const FAQS = [
  [
    'What is a JSON formatter?',
    'A JSON formatter is a tool that pretty-prints JSON by adding indentation and line breaks so the data is easier to read and debug.',
  ],
  [
    'What is a JSON validator?',
    'A JSON validator checks whether JSON syntax is correct and helps identify missing brackets, quotes, commas, or invalid values.',
  ],
  [
    'Why is JSON formatting important?',
    'Formatted JSON is easier for developers to inspect, troubleshoot, and share during API and application work.',
  ],
  [
    'Can I format JSON online for free?',
    'Yes. This online JSON formatter works in the browser and is free to use without signup.',
  ],
  [
    'What is JSON pretty print?',
    'JSON pretty print means displaying JSON in a human-readable layout with indentation and spacing.',
  ],
  [
    'Can I minify JSON too?',
    'Yes. Minifying JSON removes extra whitespace to make the output smaller and more compact for transfer or storage.',
  ],
  [
    'What is the difference between JSON formatter and validator?',
    'A formatter focuses on readability while a validator focuses on syntax correctness, though many tools do both.',
  ],
  [
    'Can JSON be used in APIs?',
    'Yes. JSON is one of the most common formats for API requests and responses because it is lightweight and easy to parse.',
  ],
  [
    'What are common JSON mistakes?',
    'Common mistakes include missing brackets, trailing commas, invalid quotes, and using the wrong data types.',
  ],
  [
    'Why do frontend apps use JSON?',
    'Frontend apps use JSON because it is simple to fetch, parse, and render in user interfaces.',
  ],
  [
    'Do backend systems exchange JSON?',
    'Yes. Backend services often exchange JSON through HTTP APIs, message queues, and integrations.',
  ],
  [
    'Is JSON the same as JavaScript?',
    'No. JSON is a data format, not a programming language, even though its syntax is similar to JavaScript object notation.',
  ],
  [
    'Can I validate JSON before deployment?',
    'Yes. Validating JSON before deployment helps prevent API failures and broken configuration files.',
  ],
  [
    'What makes formatted JSON easier to debug?',
    'Indentation and structure make nested objects and arrays easier to scan for errors and missing properties.',
  ],
  [
    'Should I use formatted or minified JSON?',
    'Use formatted JSON for debugging and development, and minified JSON for compact transfer when readability is not needed.',
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
              <tr key={row.element || row.error || row.feature || row.type} className="align-top">
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

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const inputLines = useMemo(() => input.split('\n').length, [input]);
  const outputLines = useMemo(() => output.split('\n').length, [output]);

  const setSample = (sample) => {
    setInput(sample);
    setOutput('');
    setError('');
    setCopied(false);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch {
      setError('Invalid JSON format. Please check brackets, quotes, commas, and values.');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch {
      setError('Invalid JSON format. Minify cannot run until the JSON syntax is valid.');
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('JSON is valid.');
    } catch {
      setOutput('');
      setError('JSON is invalid. Fix the syntax error before using it in an API or app.');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy failed. Please copy the output manually.');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              JSON Formatting Tool
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              JSON Formatter Online
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
              Beautify JSON, validate syntax, and minify data in one online JSON formatter. Use it
              to format JSON data for APIs, web development, mobile apps, and debugging workflows
              without installing extra software.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.02fr_0.98fr] lg:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SNIPPETS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setSample(sample.value)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    Load {sample.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Input Lines</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{inputLines}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Output Lines</p>
                  <p className="mt-2 text-2xl font-bold text-blue-700">{outputLines}</p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Input JSON</p>
                <textarea
                  className="mt-3 h-[380px] w-full resize-none rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-emerald-300 outline-none focus:ring-2 focus:ring-blue-500"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder='{"name":"John","active":true,"roles":["admin","editor"]}'
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={formatJson}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Format JSON
                </button>
                <button
                  type="button"
                  onClick={validateJson}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Validate JSON
                </button>
                <button
                  type="button"
                  onClick={minifyJson}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Minify JSON
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Output JSON
                  </p>
                  {output ? (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      {copied ? 'Copied' : 'Copy Output'}
                    </button>
                  ) : null}
                </div>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                ) : (
                  <textarea
                    className="mt-4 h-[380px] w-full resize-none rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none"
                    value={output}
                    readOnly
                    placeholder="Formatted result will appear here..."
                  />
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {error ? 'Needs Fix' : output ? 'Ready' : 'Waiting'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Mode
                  </p>
                  <p className="mt-2 text-lg font-bold text-blue-700">Format / Validate</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Use Case
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">API + Dev</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Short Answer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">What Is A JSON Formatter?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            A JSON formatter is a tool that takes raw JSON and converts it into a readable, structured
            layout. It adds indentation, line breaks, and spacing so developers can inspect objects,
            arrays, and nested data more easily. Most JSON formatting tools also validate syntax at
            the same time, which makes them useful for debugging APIs and configuration files.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">What Is JSON?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON stands for JavaScript Object Notation. It is a lightweight data format used to
                represent structured information with objects, arrays, and key-value pairs.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Why JSON Is Important</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON is widely used because it is easy for humans to read and easy for machines to
                parse. That makes it ideal for APIs, app settings, and data exchange.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">How JSON Formatting Works</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The formatter parses the text, checks whether it is valid JSON, and then pretty-prints
                it with consistent indentation or minifies it into a compact string.
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">AI Overview Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              JSON formatting improves readability, while validation catches syntax problems before
              deployment. In practice, developers use both together when working with APIs,
              configuration files, and frontend or backend data flows.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Workflow"
              title="How To Format JSON Online"
              description="Use the formatter in a simple sequence so you can confirm the data and catch syntax issues quickly."
            />
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {[
                'Paste raw JSON into the input panel or load one of the sample snippets.',
                'Click Format JSON to pretty print the data with indentation and spacing.',
                'Use Validate JSON to confirm that the syntax is correct before deployment.',
                'Click Minify JSON if you need a compact version for transport or storage.',
                'Copy the result, then use it in your API request, config file, or app code.',
              ].map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="font-semibold text-slate-900">{index + 1}.</span> {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Benefits"
              title="Benefits Of Using A JSON Formatter"
              description="Readable JSON makes debugging and communication easier across teams and environments."
            />
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {[
                'Makes complex nested data easier to scan.',
                'Helps developers find syntax errors faster.',
                'Supports API debugging during development and testing.',
                'Improves collaboration when sharing payloads with teammates.',
                'Helps frontend and backend teams work with the same data structure.',
              ].map((item) => (
                <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Structure"
            title="JSON Structure Explained"
            description="Understanding the basic syntax makes it easier to write, validate, and debug JSON."
          />
          <div className="mt-6">
            <DataTable columns={['JSON Element', 'Description', 'Example']} rows={JSON_STRUCTURE_ROWS} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Objects</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON objects hold key-value pairs inside curly braces. They are used for records,
                settings, and structured data where each property has a name.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Arrays</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Arrays store ordered lists of items inside square brackets. They are useful when one
                field needs to hold multiple values or repeated records.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Key-Value Pairs</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A key-value pair is the basic building block of JSON objects. The key is always a
                string, and the value can be a string, number, object, array, boolean, or null.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Nested JSON</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Nested JSON appears when objects contain other objects or arrays. This is common in
                API responses, app configuration, and rich structured payloads.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Comparison"
            title="JSON Formatter vs JSON Validator"
            description="The two tools overlap, but they solve different problems in the development workflow."
          />
          <div className="mt-6">
            <DataTable
              columns={['Feature', 'JSON Formatter', 'JSON Validator']}
              rows={FORMATTER_VS_VALIDATOR_ROWS}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Errors"
            title="Common JSON Errors"
            description="These are the syntax problems that show up most often in real-world payloads and config files."
          />
          <div className="mt-6">
            <DataTable columns={['JSON Error', 'Example', 'How To Fix']} rows={COMMON_ERROR_ROWS} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Missing Brackets</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON must close every object and array properly. One missing bracket can break the
                entire file and stop parsing immediately.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Invalid Quotes</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON requires double quotes for property names and string values. Single quotes are a
                common reason validation fails.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Trailing Commas</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                A final comma after the last property or array item is not valid JSON. Removing it is
                usually enough to restore validity.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Incorrect Data Types</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                JSON uses specific types such as string, number, boolean, null, object, and array.
                Using the wrong type can break an API or configuration parser.
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="APIs"
              title="JSON For APIs"
              description="APIs use JSON because it is compact, readable, and easy for systems to exchange."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {JSON_FOR_USAGE_CARDS.slice(0, 2).map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Web"
              title="JSON For Web Development"
              description="Frontend and backend teams rely on JSON to move data through modern web applications."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {JSON_FOR_USAGE_CARDS.slice(2, 4).map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Mobile"
              title="JSON For Mobile Applications"
              description="Mobile apps often receive API responses in JSON because it works well across iOS, Android, and cross-platform stacks."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Mobile teams use JSON for app settings, feed data, login responses, and feature flags.
              Formatting is useful during development, while validation helps make sure the payload
              structure stays compatible with app code and backend responses.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Usage"
              title="API Data Exchange Explained"
              description="JSON acts as the common language that lets apps, servers, and services share structured data."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              In an API workflow, a frontend app sends a JSON request body, the backend parses the
              data, processes it, and returns a JSON response. This makes JSON one of the most common
              data exchange formats for REST APIs and many modern services.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Best Practices"
            title="JSON Best Practices"
            description="Clear structure and strict syntax reduce debugging time and prevent avoidable breakage."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {JSON_BEST_PRACTICES.map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {CONTENT_LENGTH_ROWS.map((item) => (
              <article key={item.type} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.type}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.recommendation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeading
            eyebrow="Mistakes"
            title="Common JSON Formatting Mistakes"
            description="These habits slow debugging and often create issues that look smaller than they are."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {JSON_MISTAKES.map((item) => (
              <article key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Summary"
              title="Why Formatted JSON Helps Debugging"
              description="Readable indentation and structured spacing make it easier to inspect payloads and spot mistakes."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Formatted JSON improves troubleshooting because nested objects, arrays, and property
              values become easier to scan. When a response is hard to read, developers spend more
              time hunting for syntax errors instead of solving the real problem. A formatter keeps
              the data readable, while validation confirms that the structure is correct before
              deployment or integration.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionHeading
              eyebrow="Summary"
              title="Why Validation Matters Before Deployment"
              description="Validation protects API integrations and configuration files from syntax-related failures."
            />
            <p className="mt-4 text-sm leading-7 text-slate-600">
              JSON validation before deployment prevents broken payloads, failed API requests, and
              configuration errors from reaching production. It is especially important when systems
              depend on a strict schema, because even one missing comma can stop the entire payload
              from parsing correctly.
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
            description="Use these tools to support related workflows in development, documents, and productivity."
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
            name: 'JSON Formatter & Validator Online Free - Beautify & Debug JSON | MyToolsHub',
            url: 'https://toolshub.cyphersol.com/tools/json-formatter',
            description:
              'Format, validate, and beautify JSON data instantly online. Detect JSON errors, pretty-print output, and minify JSON in one free tool. No signup required.',
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
            name: 'JSON Formatter',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            url: 'https://toolshub.cyphersol.com/tools/json-formatter',
            description:
              'Format, validate, beautify, and minify JSON online for free in your browser.',
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
                name: 'JSON Formatter',
                item: 'https://toolshub.cyphersol.com/tools/json-formatter',
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
            name: 'How To Format JSON Online',
            totalTime: 'PT1M',
            step: [
              'Paste raw JSON into the input box or load a sample.',
              'Click Format JSON to pretty-print the data.',
              'Click Validate JSON to check syntax correctness.',
              'Click Minify JSON to produce a compact JSON string.',
              'Copy the result and use it in your app or API workflow.',
            ].map((step) => ({
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
