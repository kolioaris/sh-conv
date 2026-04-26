import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const memoryUsage = process.memoryUsage();
  
  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  return NextResponse.json({
    ram_mb: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
    heap_used_mb: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2),
    cpu_cores: cpus.length,
    load_avg: loadAvg[0].toFixed(2),
  });
}