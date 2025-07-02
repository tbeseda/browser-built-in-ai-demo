// global.d.ts

declare enum AvailabilityStatus {
  Available = 'available',
  Downloadable = 'downloadable',
  Downloading = 'downloading',
  Unavailable = 'unavailable',
}

// Generic API instance type
type ExperimentalApiInstance<
  Methods extends Record<string, (...args: any[]) => any> = {},
  Options extends Record<string, any> = Record<string, any>
> = Methods & {
  destroy(): void;
};

// Generic API constructor type
type ExperimentalApiConstructor<
  Instance extends ExperimentalApiInstance = ExperimentalApiInstance,
  Options extends Record<string, any> = Record<string, any>
> = {
  availability(options?: Options): Promise<AvailabilityStatus>;
  create(options?: Options): Promise<Instance>;
};

// Summarizer API
type SummarizerMethods = {
  measureInputUsage(text: string): Promise<number>;
  summarize(text: string): Promise<string>;
  summarizeStreaming(text: string): AsyncIterable<string>;
};
type Summarizer = ExperimentalApiInstance<SummarizerMethods>;
type SummarizerConstructor = ExperimentalApiConstructor<Summarizer>;
declare var Summarizer: SummarizerConstructor;

// Translator API
type TranslatorMethods = {
  translate(text: string, options?: Record<string, any>): Promise<string>;
  translateStreaming(text: string, options?: Record<string, any>): AsyncIterable<string>;
};
type Translator = ExperimentalApiInstance<TranslatorMethods>;
type TranslatorConstructor = ExperimentalApiConstructor<Translator>;
declare var Translator: TranslatorConstructor;

// LanguageDetector API
type LanguageDetectorMethods = {
  detect(text: string, options?: Record<string, any>): Promise<string>;
};
type LanguageDetector = ExperimentalApiInstance<LanguageDetectorMethods>;
type LanguageDetectorConstructor = ExperimentalApiConstructor<LanguageDetector>;
declare var LanguageDetector: LanguageDetectorConstructor;

// LanguageModel API
type LanguageModelMethods = {
  prompt(input: string, options?: Record<string, any>): Promise<string>;
  promptStreaming(input: string, options?: Record<string, any>): AsyncIterable<string>;
};
type LanguageModel = ExperimentalApiInstance<LanguageModelMethods>;
type LanguageModelConstructor = ExperimentalApiConstructor<LanguageModel>;
declare var LanguageModel: LanguageModelConstructor;

// Proofreader API
type ProofreaderMethods = {
  proofread(input: string, options?: Record<string, any>): Promise<string>;
};
type Proofreader = ExperimentalApiInstance<ProofreaderMethods>;
type ProofreaderConstructor = ExperimentalApiConstructor<Proofreader>;
declare var Proofreader: ProofreaderConstructor;

// Writer API
type WriterMethods = {
  write(input: string, options?: Record<string, any>): Promise<string>;
  writeStreaming(input: string, options?: Record<string, any>): AsyncIterable<string>;
};
type Writer = ExperimentalApiInstance<WriterMethods>;
type WriterConstructor = ExperimentalApiConstructor<Writer>;
declare var Writer: WriterConstructor;

// Rewriter API
type RewriterMethods = {
  rewrite(input: string, options?: Record<string, any>): Promise<string>;
  rewriteStreaming(input: string, options?: Record<string, any>): AsyncIterable<string>;
};
type Rewriter = ExperimentalApiInstance<RewriterMethods>;
type RewriterConstructor = ExperimentalApiConstructor<Rewriter>;
declare var Rewriter: RewriterConstructor;
