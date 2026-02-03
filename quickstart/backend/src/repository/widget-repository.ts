import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SimplifiedWidgetModelI } from '../../shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const REFERENCE_FILE = path.join(DATA_DIR, 'reference-widget.json');
const WIDGETS_DIR = path.join(DATA_DIR, 'widgets');
const NEXT_ID_FILE = path.join(DATA_DIR, 'next-id.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(WIDGETS_DIR)) {
    fs.mkdirSync(WIDGETS_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile(filePath: string, data: unknown): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getWidgetFilePath(id: number): string {
  return path.join(WIDGETS_DIR, `widget-${id}.json`);
}

function getReferenceWidget(): SimplifiedWidgetModelI | null {
  return readJsonFile<SimplifiedWidgetModelI | null>(REFERENCE_FILE, null);
}

function getNextId(): number {
  const data = readJsonFile<{ nextId: number }>(NEXT_ID_FILE, { nextId: 2 });
  return data.nextId;
}

function incrementNextId(): number {
  const nextId = getNextId();
  writeJsonFile(NEXT_ID_FILE, { nextId: nextId + 1 });
  return nextId;
}

export function initializeTempStorage(): void {
  ensureDataDir();

  // Initialize widget 1 from reference if it doesn't exist
  const widget1Path = getWidgetFilePath(1);
  if (!fs.existsSync(widget1Path)) {
    const referenceWidget = getReferenceWidget();
    if (referenceWidget) {
      writeJsonFile(widget1Path, referenceWidget);
      console.log('Widget 1 initialized from reference data');
    }
  }

  // Initialize next ID if it doesn't exist
  if (!fs.existsSync(NEXT_ID_FILE)) {
    writeJsonFile(NEXT_ID_FILE, { nextId: 2 });
  }
}

export function resetTempStorage(): void {
  // Clear all widget files
  if (fs.existsSync(WIDGETS_DIR)) {
    const files = fs.readdirSync(WIDGETS_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(WIDGETS_DIR, file));
    }
  }

  // Re-initialize widget 1 from reference
  ensureDataDir();
  const referenceWidget = getReferenceWidget();
  if (referenceWidget) {
    writeJsonFile(getWidgetFilePath(1), referenceWidget);
  }

  // Reset next ID
  writeJsonFile(NEXT_ID_FILE, { nextId: 2 });

  console.log('Temp storage reset to reference data');
}

export function getWidget(id: number): SimplifiedWidgetModelI | null {
  const filePath = getWidgetFilePath(id);
  return readJsonFile<SimplifiedWidgetModelI | null>(filePath, null);
}

export function updateWidget(id: number, updates: Partial<SimplifiedWidgetModelI>): SimplifiedWidgetModelI | null {
  const widget = getWidget(id);
  if (!widget) {
    return null;
  }

  const updatedWidget: SimplifiedWidgetModelI = {
    ...widget,
    ...updates,
    updatedDate: new Date().toISOString(),
  };

  writeJsonFile(getWidgetFilePath(id), updatedWidget);
  return updatedWidget;
}

export function createWidget(
  widget: Omit<SimplifiedWidgetModelI, 'id' | 'createdDate' | 'updatedDate'>
): SimplifiedWidgetModelI {
  const now = new Date().toISOString();
  const id = incrementNextId();

  const newWidget: SimplifiedWidgetModelI = {
    ...widget,
    id,
    config: {
      ...widget.config,
      id,
      formId: id,
    },
    createdDate: now,
    updatedDate: now,
  };

  writeJsonFile(getWidgetFilePath(id), newWidget);
  return newWidget;
}

export function deleteWidget(id: number): boolean {
  const filePath = getWidgetFilePath(id);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  fs.unlinkSync(filePath);
  return true;
}
