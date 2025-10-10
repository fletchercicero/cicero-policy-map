import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import USStateExplorer from '@/components/USStateExplorer';
import { Bill } from '@/types';

export default async function Home() {
  // Read and parse the CSV file on the server
  const csvPath = path.join(process.cwd(), 'allBills.csv');
  const fileContent = await fs.readFile(csvPath, 'utf-8');
  
  const { data } = Papa.parse<Bill>(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Transform CSV headers to match our Bill interface
      const headerMap: Record<string, string> = {
        'State': 'state',
        'State Leg': 'stateLeg',
        'Number': 'number',
        'Status': 'status',
        'Issues': 'issues',
        'Notes': 'notes',
        'Source Link': 'sourceLink',
        'Year': 'year',
      };
      return headerMap[header] || header;
    },
  });

  return <USStateExplorer bills={data} />;
}
