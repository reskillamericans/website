export { register, runProcessors };

type Processor = (options: Record<string, string>) => void;

type ProcessorInfo = {
  name: string;
  [index: string]: any;
};

// Singleton
const processors: Map<string, Processor> = new Map();

function register(name: string, proc: Processor) {
  console.log(`Registering processor: ${name}`);
  processors.set(name, proc);
}

// Run the (already registered) processors passing the options object.
function runProcessors(infos: ProcessorInfo[]) {
  for (let info of infos) {
    const proc = processors.get(info.name);
    if (proc !== undefined) {
      console.log(`Executing processor: ${info.name}`);
      proc(info);
    } else {
      console.error(`Processor ${info.name} not found`);
    }
  }
}
