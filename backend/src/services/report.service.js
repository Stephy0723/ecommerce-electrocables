export function buildBasicReport(data){ return { generatedAt:new Date().toISOString(), totals:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,Array.isArray(v)?v.length:v])) }; }
