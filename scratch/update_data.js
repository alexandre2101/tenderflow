const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('src/lib/data.ts');
let data = fs.readFileSync(targetPath, 'utf-8');

data = data.replace(/export interface Tender \{([\s\S]*?)\}/, (match, inner) => {
  return `export interface Tender {${inner}  duration: string;\n  technologies: string[];\n}`;
});

const durations = ["3 mois", "6 mois", "12 mois", "18 mois", "24 mois", "4 mois", "9 mois"];
const allTechs = ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Snowflake", "Databricks", "SAP", "React"];

data = data.replace(/(staffing: ".*?",\n\s*differentiators: ".*?",\n\s*)\}/g, (match, prefix) => {
  const duration = durations[Math.floor(Math.random() * durations.length)];
  const tech1 = allTechs[Math.floor(Math.random() * allTechs.length)];
  const tech2 = allTechs[Math.floor(Math.random() * allTechs.length)];
  const techs = Array.from(new Set([tech1, tech2]));
  return `${prefix}  duration: "${duration}",\n    technologies: ${JSON.stringify(techs)},\n  }`;
});

// Remove unused exports
data = data.replace(/\/\/ Dashboard stats[\s\S]*?\/\/ Monthly evolution data/, '// Monthly evolution data');
data = data.replace(/\/\/ Response performance by sector[\s\S]*?\/\/ Recent activity/, '// Recent activity');

fs.writeFileSync(targetPath, data);
console.log('Successfully updated data.ts');
