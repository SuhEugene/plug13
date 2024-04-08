export default function logDated(...data: any[]) { console.log(`[${new Date().toISOString()}]`, ...data) };
