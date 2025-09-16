import { NextRequest, NextResponse } from 'next/server';

interface CsvRow {
  date: string;
  time: string;
  co_gt: number;
  pt08_s1_co: number;
  nmhc_gt: number;
  c6h6_gt: number;
  pt08_s2_nmhc: number;
  nox_gt: number;
  pt08_s3_nox: number;
  no2_gt: number;
  pt08_s4_no2: number;
  pt08_s5_o3: number;
  t: number;
  rh: number;
  ah: number;
}

function parseCsvLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function validateCsvRow(row: string[], headers: string[]): CsvRow | null {
  try {
    // Create an object from headers and row values
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header.toLowerCase().replace(/[()]/g, '').replace(/\./g, '_')] = row[index];
    });

    // Parse numeric values and validate required fields
    const parsed: CsvRow = {
      date: obj.date || '',
      time: obj.time || '',
      co_gt: parseFloat(obj.co_gt || '0') || 0,
      pt08_s1_co: parseFloat(obj.pt08_s1_co || '0') || 0,
      nmhc_gt: parseFloat(obj.nmhc_gt || '0') || 0,
      c6h6_gt: parseFloat(obj.c6h6_gt || '0') || 0,
      pt08_s2_nmhc: parseFloat(obj.pt08_s2_nmhc || '0') || 0,
      nox_gt: parseFloat(obj.nox_gt || '0') || 0,
      pt08_s3_nox: parseFloat(obj.pt08_s3_nox || '0') || 0,
      no2_gt: parseFloat(obj.no2_gt || '0') || 0,
      pt08_s4_no2: parseFloat(obj.pt08_s4_no2 || '0') || 0,
      pt08_s5_o3: parseFloat(obj.pt08_s5_o3 || '0') || 0,
      t: parseFloat(obj.t || '0') || 0,
      rh: parseFloat(obj.rh || '0') || 0,
      ah: parseFloat(obj.ah || '0') || 0,
    };

    // Validate date and time format
    if (!parsed.date || !parsed.time) {
      return null;
    }

    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(parsed.date)) {
      return null;
    }

    // Basic time validation (HH:MM:SS format)
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(parsed.time)) {
      return null;
    }

    return parsed;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { success: false, message: 'File must be a CSV file' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, message: 'CSV file must contain at least a header and one data row' },
        { status: 400 }
      );
    }

    const headers = parseCsvLine(lines[0]);
    const validRows: CsvRow[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i]);
      
      if (row.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const validatedRow = validateCsvRow(row, headers);
      if (validatedRow) {
        validRows.push(validatedRow);
      } else {
        errors.push(`Row ${i + 1}: Invalid data format`);
      }
    }

    if (validRows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No valid rows found in CSV file',
          errors: errors.slice(0, 10)
        },
        { status: 400 }
      );
    }

    console.log(`Processed ${validRows.length} valid rows from ${file.name}`);
    console.log(`Found ${errors.length} invalid rows`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'File uploaded and processed successfully',
      recordsProcessed: validRows.length,
      fileName: file.name,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    });

  } catch (error) {
    console.error('Upload processing error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint. Use POST to upload files.' },
    { status: 405 }
  );
}