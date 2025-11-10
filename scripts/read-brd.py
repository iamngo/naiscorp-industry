#!/usr/bin/env python3
"""
Script để đọc và extract text từ BRD PDF file
"""

import sys
import os

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        # Try PyPDF2 first
        try:
            import PyPDF2
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page.extract_text()
                return text
        except ImportError:
            pass
        
        # Try pdfplumber
        try:
            import pdfplumber
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page.extract_text() or ""
            return text
        except ImportError:
            pass
        
        # Try pypdf
        try:
            import pypdf
            with open(pdf_path, 'rb') as file:
                pdf_reader = pypdf.PdfReader(file)
                text = ""
                for page_num, page in enumerate(pdf_reader.pages):
                    text += f"\n--- Page {page_num + 1} ---\n"
                    text += page.extract_text()
                return text
        except ImportError:
            pass
        
        return None
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    pdf_path = "public/BRD_Vietnam Industrial Supply Chain.docx.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)
    
    print("Extracting text from PDF...", file=sys.stderr)
    text = extract_pdf_text(pdf_path)
    
    if text:
        print(text)
    else:
        print("Error: Could not extract text. Please install one of:", file=sys.stderr)
        print("  pip install PyPDF2", file=sys.stderr)
        print("  pip install pdfplumber", file=sys.stderr)
        print("  pip install pypdf", file=sys.stderr)
        sys.exit(1)

