// import { NextResponse } from 'next/server';

// // ILovePDF API - FREE 250 files/month
// // Get keys from: https://developer.ilovepdf.com

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file');
//     const mode = formData.get('mode'); // 'pdf-to-word' or 'word-to-pdf'

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // API Keys from environment variables
//     const PUBLIC_KEY = process.env.ILOVEPDF_PUBLIC_KEY;
//     const SECRET_KEY = process.env.ILOVEPDF_SECRET_KEY;

//     if (!PUBLIC_KEY || !SECRET_KEY) {
//       return NextResponse.json(
//         { error: 'API keys not configured. Please add ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY to environment variables.' }, 
//         { status: 500 }
//       );
//     }

//     // ========== STEP 1: AUTHENTICATE ==========
//     const authRes = await fetch('https://api.ilovepdf.com/v1/auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ public_key: PUBLIC_KEY }),
//     });

//     if (!authRes.ok) {
//       throw new Error('Authentication failed');
//     }

//     const authData = await authRes.json();
//     const token = authData.token;

//     // ========== STEP 2: CREATE TASK ==========
//     // pdfword = PDF to Word, officepdf = Word to PDF
//     const taskType = mode === 'pdf-to-word' ? 'pdfword' : 'officepdf';
    
//     const taskRes = await fetch(`https://api.ilovepdf.com/v1/start/${taskType}`, {
//       method: 'GET',
//       headers: { 'Authorization': `Bearer ${token}` },
//     });

//     if (!taskRes.ok) {
//       throw new Error('Failed to create task');
//     }

//     const taskData = await taskRes.json();
//     const { server, task } = taskData;

//     // ========== STEP 3: UPLOAD FILE ==========
//     const uploadForm = new FormData();
//     uploadForm.append('task', task);
//     uploadForm.append('file', file);

//     const uploadRes = await fetch(`https://${server}/v1/upload`, {
//       method: 'POST',
//       headers: { 'Authorization': `Bearer ${token}` },
//       body: uploadForm,
//     });

//     if (!uploadRes.ok) {
//       throw new Error('File upload failed');
//     }

//     const uploadData = await uploadRes.json();
//     const serverFilename = uploadData.server_filename;

//     // ========== STEP 4: PROCESS FILE ==========
//     const processRes = await fetch(`https://${server}/v1/process`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         task,
//         tool: taskType,
//         files: [{ server_filename: serverFilename, filename: file.name }],
//       }),
//     });

//     if (!processRes.ok) {
//       throw new Error('Processing failed');
//     }

//     // ========== STEP 5: DOWNLOAD FILE ==========
//     const downloadRes = await fetch(`https://${server}/v1/download/${task}`, {
//       method: 'GET',
//       headers: { 'Authorization': `Bearer ${token}` },
//     });

//     if (!downloadRes.ok) {
//       throw new Error('Download failed');
//     }

//     const fileBuffer = await downloadRes.arrayBuffer();

//     // Set correct MIME type and filename
//     const outputMime = mode === 'pdf-to-word' 
//       ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       : 'application/pdf';
    
//     const outputName = mode === 'pdf-to-word' ? 'converted.docx' : 'converted.pdf';

//     // Return converted file
//     return new NextResponse(fileBuffer, {
//       headers: {
//         'Content-Type': outputMime,
//         'Content-Disposition': `attachment; filename="${outputName}"`,
//       },
//     });

//   } catch (error) {
//     console.error('Conversion error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Conversion failed. Please try again.' }, 
//       { status: 500 }
//     );
//   }
// }






// import { NextResponse } from 'next/server';

// // ILovePDF API - FREE 250 files/month
// // Website: https://developer.ilovepdf.com

// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file');
//     const mode = formData.get('mode'); // 'pdf-to-word' or 'word-to-pdf'

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // 🔑 ILovePDF API Keys from .env.local
//     const PUBLIC_KEY = process.env.ILOVEPDF_PUBLIC_KEY;
//     const SECRET_KEY = process.env.ILOVEPDF_SECRET_KEY;

//     console.log('🔍 PUBLIC_KEY:', PUBLIC_KEY?.substring(0, 20) + '...');
//     console.log('🔍 SECRET_KEY exists:', !!SECRET_KEY);

//     if (!PUBLIC_KEY || !SECRET_KEY) {
//       return NextResponse.json(
//         { error: 'API keys not configured. Add ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY to .env.local' }, 
//         { status: 500 }
//       );
//     }

//     // ========== STEP 1: AUTHENTICATE ==========
//     console.log('🔐 Step 1: Authenticating...');
    
//     const authRes = await fetch('https://api.ilovepdf.com/v1/auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ public_key: PUBLIC_KEY }),
//     });

//     console.log('📡 Auth Status:', authRes.status);

//     if (!authRes.ok) {
//       const authError = await authRes.text();
//       console.error('❌ Auth Error:', authError);
//       throw new Error(`Authentication failed: ${authError}`);
//     }

//     const authData = await authRes.json();
//     const token = authData.token;
//     console.log('✅ Token received');

//     // ========== STEP 2: CREATE TASK ==========
//     const taskType = mode === 'pdf-to-word' ? 'pdfword' : 'officepdf';
//     console.log('📋 Step 2: Creating task:', taskType);

//     const taskRes = await fetch(`https://api.ilovepdf.com/v1/start/${taskType}`, {
//       method: 'GET',
//       headers: { 'Authorization': `Bearer ${token}` },
//     });

//     console.log('📡 Task Status:', taskRes.status);

//     if (!taskRes.ok) {
//       const taskError = await taskRes.text();
//       console.error('❌ Task Error:', taskError);
//       throw new Error(`Failed to create task: ${taskError}`);
//     }

//     const taskData = await taskRes.json();
//     const { server, task } = taskData;
//     console.log('✅ Task:', task);
//     console.log('🖥️  Server:', server);

//     // ========== STEP 3: UPLOAD FILE ==========
//     console.log('📤 Step 3: Uploading file:', file.name, 'Size:', file.size);

//     // 🚨 IMPORTANT: Create fresh FormData, don't reuse
//     const uploadForm = new FormData();
//     uploadForm.append('task', task);
//     uploadForm.append('file', file, file.name);

//     const uploadRes = await fetch(`https://${server}/v1/upload`, {
//       method: 'POST',
//       headers: { 
//         'Authorization': `Bearer ${token}`,
//         // 🚨 Don't set Content-Type manually, fetch sets it with boundary
//       },
//       body: uploadForm,
//     });

//     console.log('📡 Upload Status:', uploadRes.status);

//     if (!uploadRes.ok) {
//       const uploadError = await uploadRes.text();
//       console.error('❌ Upload Error:', uploadError);
//       throw new Error(`File upload failed: ${uploadError}`);
//     }

//     const uploadData = await uploadRes.json();
//     const serverFilename = uploadData.server_filename;
//     console.log('✅ Server Filename:', serverFilename);

//     // ========== STEP 4: PROCESS FILE ==========
//     console.log('⚙️  Step 4: Processing...');

//     const processRes = await fetch(`https://${server}/v1/process`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         task,
//         tool: taskType,
//         files: [{ 
//           server_filename: serverFilename, 
//           filename: file.name 
//         }],
//       }),
//     });

//     console.log('📡 Process Status:', processRes.status);

//     if (!processRes.ok) {
//       const processError = await processRes.text();
//       console.error('❌ Process Error:', processError);
//       throw new Error(`Processing failed: ${processError}`);
//     }

//     const processData = await processRes.json();
//     console.log('✅ Processed:', processData);

//     // ========== STEP 5: DOWNLOAD FILE ==========
//     console.log('⬇️  Step 5: Downloading...');

//     const downloadRes = await fetch(`https://${server}/v1/download/${task}`, {
//       method: 'GET',
//       headers: { 'Authorization': `Bearer ${token}` },
//     });

//     console.log('📡 Download Status:', downloadRes.status);

//     if (!downloadRes.ok) {
//       const downloadError = await downloadRes.text();
//       console.error('❌ Download Error:', downloadError);
//       throw new Error(`Download failed: ${downloadError}`);
//     }

//     const fileBuffer = await downloadRes.arrayBuffer();
//     console.log('✅ Downloaded bytes:', fileBuffer.byteLength);

//     // Set correct MIME type and filename
//     const outputMime = mode === 'pdf-to-word' 
//       ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       : 'application/pdf';
    
//     const outputName = mode === 'pdf-to-word' ? 'converted.docx' : 'converted.pdf';

//     console.log('🎉 SUCCESS! Returning file:', outputName);

//     return new NextResponse(fileBuffer, {
//       headers: {
//         'Content-Type': outputMime,
//         'Content-Disposition': `attachment; filename="${outputName}"`,
//       },
//     });

//   } catch (error) {
//     console.error('❌ FATAL ERROR:', error);
//     return NextResponse.json(
//       { error: error.message || 'Conversion failed. Please try again.' }, 
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

const ILOVEPDF_REGION = 'us';
const require = createRequire(import.meta.url);

async function readErrorMessage(response, fallbackMessage) {
  const raw = await response.text();

  if (!raw) {
    return fallbackMessage;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed.error || parsed.message || raw;
  } catch {
    return raw;
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function convertPdfToWordLocally(file) {
  const { PDFParse } = await import('pdf-parse');

  const pdfBuffer = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({ data: pdfBuffer });

  try {
    const result = await parser.getText();
    const extractedText = (result?.text || '').replace(/\r\n/g, '\n').trim();

    if (!extractedText) {
      throw new Error('No readable text found in this PDF. Scanned/image PDFs are not supported by this converter.');
    }

    const paragraphs = extractedText
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`);

    const htmlDocument = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Converted Document</title>
</head>
<body>
${paragraphs.join('\n')}
</body>
</html>`;

    return Buffer.from(htmlDocument, 'utf8');
  } finally {
    await parser.destroy();
  }
}

async function convertWordToPdfWithILovePDF(file, publicKey) {
  const secretKey = process.env.ILOVEPDF_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error('ILOVEPDF_SECRET_KEY is missing in .env.local');
  }

  const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
  const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ilovepdf-'));
  const tempInputPath = path.join(tempDir, file.name || 'input.docx');

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempInputPath, fileBuffer);

    const instance = new ILovePDFApi(publicKey, secretKey);
    const task = instance.newTask('officepdf');

    await task.start();
    await task.addFile(new ILovePDFFile(tempInputPath));
    await task.process();

    const output = await task.download();
    return Buffer.from(output);
  } catch (error) {
    throw new Error(error?.message || 'Word to PDF conversion failed');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const mode = formData.get('mode');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (mode === 'pdf-to-word') {
      const docBuffer = await convertPdfToWordLocally(file);

      return new NextResponse(docBuffer, {
        headers: {
          'Content-Type': 'application/msword; charset=utf-8',
          'Content-Disposition': 'attachment; filename="converted.doc"',
        },
      });
    }

    if (mode !== 'word-to-pdf') {
      return NextResponse.json({ error: 'Invalid conversion mode' }, { status: 400 });
    }

    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY?.trim();

    if (!publicKey) {
      return NextResponse.json(
        { error: 'ILOVEPDF_PUBLIC_KEY is missing in .env.local' },
        { status: 500 }
      );
    }

    const pdfBuffer = await convertWordToPdfWithILovePDF(file, publicKey);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);

    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    );
  }
}
