/**
 * Text pagination utility
 * Splits long text content into readable pages based on available space
 */

import { Dimensions } from 'react-native';
import { FONT_SIZES, ReadingPreferences } from '@/types';

// Approximate characters per line based on font size and screen width
const getCharsPerLine = (fontSize: number, screenWidth: number, padding: number): number => {
  // Rough estimate: average character width is about 0.5-0.6 of font size
  const avgCharWidth = fontSize * 0.52;
  const availableWidth = screenWidth - padding * 2;
  return Math.floor(availableWidth / avgCharWidth);
};

// Approximate lines per page based on font size and screen height
const getLinesPerPage = (fontSize: number, screenHeight: number, padding: number): number => {
  // Line height is typically 1.6-1.8 of font size for comfortable reading
  const lineHeight = fontSize * 1.7;
  // Reserve space for header/footer UI elements
  const reservedSpace = 200;
  const availableHeight = screenHeight - reservedSpace - padding * 2;
  return Math.floor(availableHeight / lineHeight);
};

export interface PaginationResult {
  pages: string[];
  totalPages: number;
}

/**
 * Paginates text content into pages suitable for reading
 */
export const paginateText = (
  content: string,
  fontSizeKey: ReadingPreferences['fontSize']
): PaginationResult => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const fontSize = FONT_SIZES[fontSizeKey];
  const padding = 24;

  const charsPerLine = getCharsPerLine(fontSize, screenWidth, padding);
  const linesPerPage = getLinesPerPage(fontSize, screenHeight, padding);

  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  const pages: string[] = [];
  let currentPageLines: string[] = [];
  let currentLineCount = 0;

  for (const paragraph of paragraphs) {
    // Split paragraph into words
    const words = paragraph.trim().split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (testLine.length <= charsPerLine) {
        currentLine = testLine;
      } else {
        // Line is full, add it to current page
        if (currentLine) {
          if (currentLineCount >= linesPerPage) {
            // Page is full, start new page
            pages.push(currentPageLines.join('\n'));
            currentPageLines = [];
            currentLineCount = 0;
          }
          currentPageLines.push(currentLine);
          currentLineCount++;
        }
        currentLine = word;
      }
    }

    // Add remaining line from paragraph
    if (currentLine) {
      if (currentLineCount >= linesPerPage) {
        pages.push(currentPageLines.join('\n'));
        currentPageLines = [];
        currentLineCount = 0;
      }
      currentPageLines.push(currentLine);
      currentLineCount++;
    }

    // Add paragraph break (empty line) if there's room
    if (currentLineCount < linesPerPage - 1) {
      currentPageLines.push('');
      currentLineCount++;
    }
  }

  // Add final page if there's content
  if (currentPageLines.length > 0) {
    pages.push(currentPageLines.join('\n').trim());
  }

  return {
    pages,
    totalPages: pages.length,
  };
};

/**
 * Alternative simpler pagination that splits by approximate character count
 * More reliable for various screen sizes
 */
export const paginateTextSimple = (
  content: string,
  fontSizeKey: ReadingPreferences['fontSize']
): PaginationResult => {
  const { height: screenHeight } = Dimensions.get('window');
  const fontSize = FONT_SIZES[fontSizeKey];

  // Calculate approximate characters per page
  // Based on font size and available screen real estate
  const lineHeight = fontSize * 1.7;
  const reservedSpace = 220; // Header, footer, padding
  const availableHeight = screenHeight - reservedSpace;
  const linesPerPage = Math.floor(availableHeight / lineHeight);

  // Approximate chars per line (for average screen width)
  const charsPerLine = Math.floor(320 / (fontSize * 0.5));
  const charsPerPage = linesPerPage * charsPerLine;

  // Split content preserving paragraphs as much as possible
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const pages: string[] = [];
  let currentPage = '';

  for (const paragraph of paragraphs) {
    const paragraphWithBreak = currentPage ? `\n\n${paragraph}` : paragraph;

    if ((currentPage + paragraphWithBreak).length <= charsPerPage) {
      currentPage += paragraphWithBreak;
    } else {
      // Paragraph doesn't fit, need to split
      if (currentPage) {
        pages.push(currentPage.trim());
        currentPage = '';
      }

      // If paragraph itself is too long, split it
      if (paragraph.length > charsPerPage) {
        const words = paragraph.split(/\s+/);
        let chunk = '';

        for (const word of words) {
          const testChunk = chunk ? `${chunk} ${word}` : word;
          if (testChunk.length <= charsPerPage) {
            chunk = testChunk;
          } else {
            if (chunk) {
              pages.push(chunk.trim());
            }
            chunk = word;
          }
        }

        if (chunk) {
          currentPage = chunk;
        }
      } else {
        currentPage = paragraph;
      }
    }
  }

  // Add final page
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  // Ensure at least one page
  if (pages.length === 0) {
    pages.push(content);
  }

  return {
    pages,
    totalPages: pages.length,
  };
};
