// global.d.ts

enum AvailabilityStatus {
  Available = 'available',
  Downloadable = 'downloadable',
  Downloading = 'downloading',
  Unavailable = 'unavailable',
}

// Summarizer options for creation
interface SummarizerOptions {
  sharedContext?: string;
  type?: string;
  length?: string;
  format?: string;
  expectedInputLanguages?: string[];
  outputLanguage?: string;
  monitor?: (monitor: any) => void;
}

// Summarizer instance interface
interface Summarizer {
  readonly expectedContextLanguages?: string[];
  readonly expectedInputLanguages?: string[];
  readonly format?: string;
  readonly inputQuota?: number;
  readonly length?: string;
  readonly outputLanguage?: string;
  readonly sharedContext?: string;
  readonly type?: string;

  destroy(): void;
  measureInputUsage(text: string): Promise<number>;
  summarize(text: string): Promise<string>;
  summarizeStreaming(text: string): AsyncIterable<string>;
}

// Summarizer static interface
interface SummarizerConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: SummarizerOptions): Promise<Summarizer>;
}

declare var Summarizer: SummarizerConstructor;

// Translator API
interface TranslatorOptions {
  // Add any options as needed, e.g. input/output languages, context, etc.
  [key: string]: any;
}

interface Translator {
  translate(text: string, options?: object): Promise<string>;
  translateStreaming(text: string, options?: object): AsyncIterable<string>;
  destroy(): void;
}

interface TranslatorConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: TranslatorOptions): Promise<Translator>;
}

declare var Translator: TranslatorConstructor;

// LanguageDetector API
interface LanguageDetectorOptions {
  // Add any options as needed
  [key: string]: any;
}

interface LanguageDetector {
  detect(text: string, options?: object): Promise<string>;
  destroy(): void;
}

interface LanguageDetectorConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: LanguageDetectorOptions): Promise<LanguageDetector>;
}

declare var LanguageDetector: LanguageDetectorConstructor;

// LanguageModel API
interface LanguageModelOptions {
  // Add any options as needed, e.g. model, context, etc.
  [key: string]: any;
}

interface LanguageModelPromptOptions {
  // Options for the prompt method, such as stop sequences, temperature, etc.
  [key: string]: any;
}

interface LanguageModelPromptResult {
  output: string;
  // Add any additional properties returned by the API
}

interface LanguageModel {
  prompt(input: string, options?: LanguageModelPromptOptions): Promise<LanguageModelPromptResult>;
  destroy(): void;
}

interface LanguageModelConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: LanguageModelOptions): Promise<LanguageModel>;
}

declare var LanguageModel: LanguageModelConstructor;

// Proofreader API
interface ProofreaderOptions {
  // Add any options as needed, e.g. language, context, etc.
  [key: string]: any;
}

interface ProofreaderResult {
  output: string;
  // Add any additional properties returned by the API
}

interface Proofreader {
  proofread(input: string, options?: object): Promise<ProofreaderResult>;
  destroy(): void;
}

interface ProofreaderConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: ProofreaderOptions): Promise<Proofreader>;
}

declare var Proofreader: ProofreaderConstructor;

// Writer API
interface WriterOptions {
  // Add any options as needed, e.g. style, context, etc.
  [key: string]: any;
}

interface WriterResult {
  output: string;
  // Add any additional properties returned by the API
}

interface Writer {
  write(input: string, options?: object): Promise<WriterResult>;
  writeStreaming(input: string, options?: object): AsyncIterable<string>;
  destroy(): void;
}

interface WriterConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: WriterOptions): Promise<Writer>;
}

declare var Writer: any;

// Rewriter API
interface RewriterOptions {
  // Add any options as needed, e.g. style, context, etc.
  [key: string]: any;
}

interface RewriterResult {
  output: string;
  // Add any additional properties returned by the API
}

interface Rewriter {
  rewrite(input: string, options?: object): Promise<RewriterResult>;
  rewriteStreaming(input: string, options?: object): AsyncIterable<string>;
  destroy(): void;
}

interface RewriterConstructor {
  availability(): Promise<AvailabilityStatus>;
  create(options?: RewriterOptions): Promise<Rewriter>;
}

declare var Rewriter: RewriterConstructor;
