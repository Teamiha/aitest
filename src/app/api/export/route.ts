import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { HistoryEntry } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { history }: { history: HistoryEntry[] } = body;

    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: 'History data is required and must be an array' },
        { status: 400 }
      );
    }

    // Flatten the history data for Excel format
    const flattenedData = history.flatMap((entry) =>
      entry.responses.map((response) => ({
        Timestamp: new Date(entry.timestamp).toLocaleString(),
        Prompt: entry.prompt,
        Temperature: entry.temperature,
        Model: response.model,
        SeedUsed: response.seedUsed ? 'Yes' : 'No',
        Response: response.response,
      }))
    );

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(flattenedData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 20 }, // Timestamp
      { wch: 40 }, // Prompt
      { wch: 12 }, // Temperature
      { wch: 15 }, // Model
      { wch: 10 }, // SeedUsed
      { wch: 50 }, // Response
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'AI Response History');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ai-response-history-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
